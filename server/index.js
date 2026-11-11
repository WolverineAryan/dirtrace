const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dirtrace_motorsport_secret_key_2026';

app.use(cors());
app.use(express.json());

// Serve static uploaded files (flyers, logos)
app.use('/uploads', express.static(require('path').join(__dirname, '../client/public/uploads')));

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired session token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role, phone, fmsciNumber } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'rider',
      phone: phone || '',
      fmsciNumber: fmsciNumber || '',
      createdAt: new Date().toISOString()
    };

    db.data.users.push(newUser);
    db.save();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = newUser;
    res.status(201).json({ token, user: userWithoutPass });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = user;
    res.json({ token, user: userWithoutPass });
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { password: _, ...userWithoutPass } = user;
  
  // Attach associated club if any
  const club = db.data.clubs.find(c => c.ownerId === user.id);
  
  // Attach user registrations
  const registrations = db.data.registrations.filter(r => r.userId === user.id);

  res.json({
    user: userWithoutPass,
    club: club || null,
    registrations
  });
});

// --- CLUBS ROUTES ---
app.get('/api/clubs', (req, res) => {
  const clubsWithStats = db.data.clubs.map(club => {
    const events = db.data.events.filter(e => e.clubId === club.id && e.status === 'published');
    const totalRacers = db.data.registrations.filter(r => events.some(e => e.id === r.eventId)).length;
    return {
      ...club,
      activeEventsCount: events.length,
      totalRacersHost: totalRacers
    };
  });
  res.json(clubsWithStats);
});

app.get('/api/clubs/:id', (req, res) => {
  const club = db.data.clubs.find(c => c.id === req.params.id || c.slug === req.params.id);
  if (!club) return res.status(404).json({ error: 'Club not found' });

  const events = db.data.events.filter(e => e.clubId === club.id);
  res.json({ club, events });
});

// Create new club (Official Club monetization)
app.post('/api/clubs', authenticateToken, (req, res) => {
  try {
    const { name, type, description, location, contactPerson, contactPhone, whatsappGroup } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Club name and description are required' });
    }

    const existingClub = db.data.clubs.find(c => c.ownerId === req.user.id);
    if (existingClub) {
      return res.status(400).json({ error: 'You already have a registered club: ' + existingClub.name });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newClub = {
      id: 'club_' + Date.now(),
      name,
      slug,
      type: type || 'bike',
      ownerId: req.user.id,
      description,
      location: location || 'Pune, India',
      contactPerson: contactPerson || req.user.name,
      contactPhone: contactPhone || '',
      contactEmail: req.user.email,
      status: 'pending_payment', // Requires payment of official club fee to activate!
      tier: 'pending',
      feePaid: 0,
      freeEventsRemaining: 0,
      whatsappGroup: whatsappGroup || '',
      logoUrl: '/uploads/pune_throttle.jpg',
      createdAt: new Date().toISOString()
    };

    db.data.clubs.push(newClub);

    // Update user role to club_organizer if not already
    const user = db.data.users.find(u => u.id === req.user.id);
    if (user && user.role !== 'admin') {
      user.role = 'club_organizer';
    }

    db.save();
    res.status(201).json({
      club: newClub,
      message: 'Club registered! Please complete the Official Club Verification fee (₹2,999) to unlock event hosting & official status.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create club: ' + err.message });
  }
});

// Pay Official Club Activation Fee (Simulated Gateway)
app.post('/api/clubs/:id/pay-activation', authenticateToken, (req, res) => {
  try {
    const club = db.data.clubs.find(c => c.id === req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });
    if (club.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only the club owner can pay accreditation fee' });
    }

    const amount = 2999;
    club.status = 'active';
    club.tier = 'official_club';
    club.feePaid = amount;
    club.freeEventsRemaining = 1; // 1 free event granted with up to 15 registrations!

    const tx = {
      id: 'tx_' + Date.now(),
      userId: req.user.id,
      type: 'club_creation_fee',
      title: `${club.name} Official Accreditation Fee`,
      amount,
      reference: 'DIRT-ACC-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    db.data.transactions.push(tx);
    db.save();

    res.json({
      success: true,
      club,
      transaction: tx,
      message: 'Official Club status unlocked! You have received 1 Free Event Hosting quota (up to 15 racers).'
    });
  } catch (err) {
    res.status(500).json({ error: 'Payment processing error: ' + err.message });
  }
});

// --- EVENTS ROUTES ---
app.get('/api/events', (req, res) => {
  const events = db.data.events.filter(e => e.status !== 'banned').map(evt => {
    const regCount = db.data.registrations.filter(r => r.eventId === evt.id && r.status === 'confirmed').length;
    return {
      ...evt,
      currentRegistrations: regCount
    };
  });
  res.json(events);
});

app.get('/api/events/:id', (req, res) => {
  const event = db.data.events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const registrations = db.data.registrations.filter(r => r.eventId === event.id && r.status === 'confirmed');
  const takenNumbers = db.getTakenNumbers(event.id);

  res.json({
    event: {
      ...event,
      currentRegistrations: registrations.length
    },
    takenNumbers,
    registrations: registrations.map(r => ({
      id: r.id,
      riderName: r.riderName,
      bikeModel: r.bikeModel,
      competitionNumber: r.competitionNumber,
      classes: r.classes,
      createdAt: r.createdAt
    }))
  });
});

// Check Duplicate Event Pre-validation
app.post('/api/events/check-duplicate', (req, res) => {
  const { title, venue, startDate } = req.body;
  const duplicateCheck = db.checkDuplicateEvent({ title, venue, startDate });
  res.json(duplicateCheck);
});

// Host New Event
app.post('/api/events', authenticateToken, (req, res) => {
  try {
    const userClub = db.data.clubs.find(c => c.ownerId === req.user.id);
    if (!userClub) {
      return res.status(400).json({ error: 'You must have a registered club to host events' });
    }

    if (userClub.status !== 'active') {
      return res.status(402).json({
        error: 'Official Club Activation required. Please complete your club fee to unlock event hosting.',
        requiresClubPayment: true
      });
    }

    const {
      title, subtitle, tagline, category, eventType, startDate, endDate,
      venue, city, state, baseEntryFee, classes, rules, sanctionedBy,
      contactPerson, contactPhone, whatsappLink, fmsciLicenseLink
    } = req.body;

    if (!title || !startDate || !venue || !city) {
      return res.status(400).json({ error: 'Title, start date, venue, and city are required' });
    }

    // --- DUPLICATE EVENT DETECTION & BANNING PROTECTION ---
    const dupCheck = db.checkDuplicateEvent({ title, venue, startDate });
    if (dupCheck.isDuplicate) {
      return res.status(409).json({
        error: 'DUPLICATE EVENT DETECTED: ' + dupCheck.reason,
        duplicate: true,
        matchedEventId: dupCheck.matchedEventId,
        matchedEventTitle: dupCheck.matchedEventTitle
      });
    }

    const newEvent = {
      id: 'evt_' + Date.now(),
      clubId: userClub.id,
      clubName: userClub.name,
      title,
      subtitle: subtitle || 'MOTORSPORT SHOWDOWN',
      tagline: tagline || '',
      category: category || 'bike',
      eventType: eventType || 'Dirt Track',
      startDate,
      endDate: endDate || startDate,
      venue,
      city,
      state: state || 'Maharashtra',
      baseEntryFee: Number(baseEntryFee) || 1500,
      tier: 'free_tier',
      maxRegistrations: 15, // Free tier allows up to 15 registrations!
      currentRegistrations: 0,
      isProUnlocked: false,
      proUpgradeFee: 1499,
      status: 'published',
      sanctionedBy: sanctionedBy || 'FMSCI Sanctioned',
      contactPerson: contactPerson || userClub.contactPerson,
      contactPhone: contactPhone || userClub.contactPhone,
      whatsappLink: whatsappLink || userClub.whatsappGroup,
      fmsciLicenseLink: fmsciLicenseLink || 'https://lic.fmsci.co.in/#/oneevent-fmsci',
      googleFormLink: '',
      bannerImage: '/uploads/pune_throttle.jpg',
      prizesFlyerImage: '/uploads/pune_prizes.jpg',
      rules: rules && rules.length ? rules : [
        'Choice Numbers: Assigned strictly on a first-come, first-served basis only upon confirmation of entry fee.',
        'Bike Sharing: Allowed across different classes.',
        'Number Mapping: One Bike = One Competition Number.',
        'Multiple Entries: Riders can participate in multiple classes (max 4 classes for Championship points).',
        'Mandatory Documents: FMSCI License, Bike RC Book, and Insurance Copy are STRICTLY MANDATORY.'
      ],
      classes: classes && classes.length ? classes : [
        { id: 'c1', name: 'OPEN CLASS', fee: 1500, p1: 10000, p2: 6000, p3: 4000, p4: 'Medal', p5: 'Medal' }
      ],
      createdAt: new Date().toISOString()
    };

    db.data.events.push(newEvent);
    if (userClub.freeEventsRemaining > 0) {
      userClub.freeEventsRemaining -= 1;
    }
    db.save();

    res.status(201).json({
      event: newEvent,
      message: 'Event created successfully on Free Tier (15 racers capacity). You can upgrade to Pro for unlimited racers at any time.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event: ' + err.message });
  }
});

// Upgrade Event to Pro Tier (Lifts 15-racer limit to unlimited)
app.post('/api/events/:id/upgrade-pro', authenticateToken, (req, res) => {
  try {
    const event = db.data.events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const club = db.data.clubs.find(c => c.id === event.clubId);
    if (!club || (club.ownerId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Only the event host club can upgrade this event' });
    }

    const upgradeFee = 1499;
    event.tier = 'unlimited_pro';
    event.maxRegistrations = 9999;
    event.isProUnlocked = true;

    const tx = {
      id: 'tx_pro_' + Date.now(),
      userId: req.user.id,
      type: 'event_upgrade_fee',
      title: `Pro Event Pass Upgrade: ${event.title}`,
      amount: upgradeFee,
      reference: 'DIRT-PRO-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    db.data.transactions.push(tx);
    db.save();

    res.json({
      success: true,
      event,
      transaction: tx,
      message: 'Event successfully upgraded to Pro Tier! Racer cap lifted to Unlimited.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Upgrade failed: ' + err.message });
  }
});

// --- RACER REGISTRATION & CHOICE NUMBER ENGINE ---
app.post('/api/events/:id/register', authenticateToken, (req, res) => {
  try {
    const event = db.data.events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.status === 'banned') return res.status(400).json({ error: 'This event is unavailable or banned' });

    const existingConfirmedRegs = db.data.registrations.filter(r => r.eventId === event.id && r.status === 'confirmed');
    
    // Check 15-registration free tier limit!
    if (!event.isProUnlocked && existingConfirmedRegs.length >= event.maxRegistrations) {
      return res.status(422).json({
        error: `Registration limit of ${event.maxRegistrations} racers reached for this event under Free Tier. The organizer must upgrade to Pro Tier to accept more entries.`,
        limitReached: true,
        maxRegistrations: event.maxRegistrations,
        isProUnlocked: false
      });
    }

    const {
      riderName, riderPhone, riderEmail, bikeModel, competitionNumber,
      selectedClasses, isChampionship, bikeSharing, fmsciLicenseNo,
      hasRcBook, hasInsurance
    } = req.body;

    if (!riderName || !competitionNumber || !bikeModel) {
      return res.status(400).json({ error: 'Rider Name, Choice Number, and Bike/Car Model are required' });
    }

    if (!selectedClasses || selectedClasses.length === 0) {
      return res.status(400).json({ error: 'Please select at least 1 racing class' });
    }

    // Rule: Maximum 4 classes for Championship
    if (isChampionship && selectedClasses.length > 4) {
      return res.status(400).json({
        error: 'Championship Rule Violation: A maximum of 4 classes can be selected for championship points.'
      });
    }

    // Rule: Mandatory documents verification
    if (!fmsciLicenseNo || !hasRcBook || !hasInsurance) {
      return res.status(400).json({
        error: 'Mandatory Requirements: Valid FMSCI License, Bike RC Book, and Insurance copy acknowledgment are required.'
      });
    }

    // Rule: FIRST-COME, FIRST-SERVED CHOICE NUMBERS! (One Bike = One Competition Number)
    const compNumStr = String(competitionNumber).trim();
    if (db.isNumberTaken(event.id, compNumStr)) {
      return res.status(409).json({
        error: `Competition Number #${compNumStr} is ALREADY RESERVED on first-come, first-served basis! Please pick another number.`,
        numberTaken: true,
        competitionNumber: compNumStr
      });
    }

    const totalFee = (event.baseEntryFee || 1500) * selectedClasses.length;

    const newRegistration = {
      id: 'reg_' + Date.now(),
      eventId: event.id,
      eventTitle: event.title,
      userId: req.user.id,
      riderName,
      riderPhone: riderPhone || req.user.phone || '',
      riderEmail: riderEmail || req.user.email,
      bikeModel,
      competitionNumber: compNumStr,
      classes: selectedClasses,
      isChampionship: !!isChampionship,
      bikeSharing: !!bikeSharing,
      fmsciLicenseNo,
      hasRcBook: !!hasRcBook,
      hasInsurance: !!hasInsurance,
      totalFee,
      status: 'confirmed',
      qrTicket: `DIRT-${event.city.substring(0,3).toUpperCase()}-${compNumStr}-${Math.random().toString(36).substring(2,6).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };

    db.data.registrations.push(newRegistration);
    event.currentRegistrations = existingConfirmedRegs.length + 1;
    
    // Record registration fee payment
    const regTx = {
      id: 'tx_reg_' + Date.now(),
      userId: req.user.id,
      type: 'race_registration_fee',
      title: `Race Entry Fee: #${compNumStr} - ${event.title}`,
      amount: totalFee,
      reference: 'DIRT-RACER-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    db.data.transactions.push(regTx);

    db.save();

    res.status(201).json({
      registration: newRegistration,
      transaction: regTx,
      message: `Registration confirmed! Competition Number #${compNumStr} is locked in for you.`
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// --- DASHBOARDS ---
app.get('/api/dashboard/rider', authenticateToken, (req, res) => {
  const myRegistrations = db.data.registrations.filter(r => r.userId === req.user.id);
  const eventsWithDetails = myRegistrations.map(r => {
    const event = db.data.events.find(e => e.id === r.eventId);
    return {
      registration: r,
      event: event || null
    };
  });

  res.json({
    riderId: req.user.id,
    registrations: eventsWithDetails,
    totalEntries: myRegistrations.length,
    activeNumbers: myRegistrations.map(r => ({ number: r.competitionNumber, eventTitle: r.eventTitle }))
  });
});

app.get('/api/dashboard/club', authenticateToken, (req, res) => {
  const club = db.data.clubs.find(c => c.ownerId === req.user.id);
  if (!club) {
    return res.json({ hasClub: false, club: null, events: [], registrations: [] });
  }

  const events = db.data.events.filter(e => e.clubId === club.id);
  const eventIds = events.map(e => e.id);
  const registrations = db.data.registrations.filter(r => eventIds.includes(r.eventId));

  const totalRevenue = registrations.reduce((acc, r) => acc + (r.totalFee || 0), 0);

  res.json({
    hasClub: true,
    club,
    events: events.map(evt => ({
      ...evt,
      confirmedCount: registrations.filter(r => r.eventId === evt.id).length
    })),
    registrations,
    stats: {
      totalEvents: events.length,
      totalRacers: registrations.length,
      totalRevenueGenerated: totalRevenue,
      freeTierQuota: club.freeEventsRemaining
    }
  });
});

// --- STATS & SAMPLE DATA HELPER ---
app.get('/api/platform-stats', (req, res) => {
  res.json({
    totalClubs: db.data.clubs.length,
    totalEvents: db.data.events.length,
    totalRacers: db.data.registrations.length,
    puneEvent: db.data.events.find(e => e.id === 'evt_deccan_conqueror_2')
  });
});

// Serve built client frontend
const clientDistPath = require('path').join(__dirname, '../client/dist');
if (require('fs').existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(require('path').join(clientDistPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🏎️ DirTrace Motorsport Server running on port ${PORT}`);
  });
}

module.exports = app;

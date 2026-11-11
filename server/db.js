const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Support writable /tmp in Vercel serverless environment
const DATA_FILE = process.env.VERCEL 
  ? path.join('/tmp', 'dirtrace_data.json')
  : path.join(__dirname, 'data.json');

// Initial seed data
const getInitialData = () => {
  const hashedPassword = bcrypt.hashSync('racer123', 10);
  const clubPassword = bcrypt.hashSync('roadiez123', 10);
  const adminPassword = bcrypt.hashSync('admin123', 10);

  return {
    users: [
      {
        id: 'usr_admin',
        name: 'DirTrace Admin',
        email: 'admin@dirtrace.com',
        password: adminPassword,
        role: 'admin',
        phone: '+91 99999 88888',
        createdAt: '2026-11-01T10:00:00.000Z'
      },
      {
        id: 'usr_roadiez',
        name: 'Amarendra Sathe (Roadiez)',
        email: 'roadiez@puneadventure.com',
        password: clubPassword,
        role: 'club_organizer',
        phone: '+91 98230 97512',
        createdAt: '2026-11-02T10:00:00.000Z'
      },
      {
        id: 'usr_rider1',
        name: 'Pranav Thormise',
        email: 'pranav@racing.com',
        password: hashedPassword,
        role: 'rider',
        phone: '+91 98765 43210',
        fmsciNumber: 'FMSCI-2026-MH-8492',
        createdAt: '2026-11-05T10:00:00.000Z'
      },
      {
        id: 'usr_rider2',
        name: 'Kabir Deshmukh',
        email: 'kabir@throttlers.in',
        password: hashedPassword,
        role: 'rider',
        phone: '+91 98221 44556',
        fmsciNumber: 'FMSCI-2026-MH-9102',
        createdAt: '2026-11-06T12:00:00.000Z'
      }
    ],
    clubs: [
      {
        id: 'club_roadiez',
        name: 'Roadiez Adventure Club',
        slug: 'roadiez-adventure-club',
        type: 'bike',
        ownerId: 'usr_roadiez',
        description: 'Premier motorcycle motorsport club founded in Pune. FMSCI affiliated, specializing in dirt-track racing, supercross & off-road adventure expeditions.',
        location: 'Pune, Maharashtra',
        contactPerson: 'Amarendra Sathe Sir',
        contactPhone: '+91 98230 97512',
        contactEmail: 'roadiez@puneadventure.com',
        status: 'active', // paid official club
        tier: 'official_club',
        feePaid: 2999,
        freeEventsRemaining: 1, // Has 1 free tier event with 15 max registrations
        whatsappGroup: 'https://chat.whatsapp.com/IWvmQUilUp7Jayz05Usftk',
        logoUrl: '/uploads/pune_throttle.jpg',
        createdAt: '2026-11-02T11:00:00.000Z'
      },
      {
        id: 'club_apex_cars',
        name: 'Apex Octane Auto Club',
        slug: 'apex-octane-auto-club',
        type: 'car',
        ownerId: 'usr_admin',
        description: 'Autocross, drag sprint, and rally car community based in Western India. High-power track days and sanctioned sprints.',
        location: 'Mumbai & Pune',
        contactPerson: 'Vikram Merchant',
        contactPhone: '+91 97654 32109',
        contactEmail: 'contact@apexoctane.org',
        status: 'active',
        tier: 'official_club',
        feePaid: 2999,
        freeEventsRemaining: 0,
        whatsappGroup: 'https://chat.whatsapp.com/sample',
        logoUrl: '/uploads/pune_prizes.jpg',
        createdAt: '2026-11-03T14:30:00.000Z'
      }
    ],
    events: [
      {
        id: 'evt_deccan_conqueror_2',
        clubId: 'club_roadiez',
        clubName: 'Roadiez Adventure Club',
        title: 'Deccan Conqueror Dirt Track : Pune 2.0',
        subtitle: 'PUNE FULL THROTTLE',
        tagline: "Born in the land of Chhatrapati Shivaji Maharaj's valor, it's time for Pune's youth to experience pure adrenaline & dirt-flying thrill!",
        category: 'bike',
        eventType: 'Dirt Track Racing',
        startDate: '2026-11-14',
        endDate: '2026-11-15',
        venue: 'AISSMS College Ground',
        city: 'Pune',
        state: 'Maharashtra',
        baseEntryFee: 1500,
        tier: 'free_tier', // Starts on club free tier (15 max participants)
        maxRegistrations: 15, // Capped at 15 until upgraded!
        currentRegistrations: 6,
        isProUnlocked: false,
        proUpgradeFee: 1499,
        status: 'published', // 'published', 'draft', 'banned'
        sanctionedBy: 'FMSCI (The Federation of Motor Sports Clubs of India)',
        contactPerson: 'Amarendra Sathe Sir',
        contactPhone: '+91 98230 97512',
        whatsappLink: 'https://chat.whatsapp.com/IWvmQUilUp7Jayz05Usftk',
        fmsciLicenseLink: 'https://lic.fmsci.co.in/#/oneevent-fmsci',
        googleFormLink: 'https://forms.gle/t5yayxckj23s7kqD8',
        bannerImage: '/uploads/pune_throttle.jpg',
        prizesFlyerImage: '/uploads/pune_prizes.jpg',
        rules: [
          'Choice Numbers: Assigned strictly on a first-come, first-served basis only upon confirmation of entry fee.',
          'Bike Sharing: Allowed across different classes.',
          'Number Mapping: One Bike = One Competition Number.',
          'Multiple Entries: Riders can participate in multiple classes, but can select a MAXIMUM OF 4 CLASSES for the Championship points.',
          'Mandatory Documents: FMSCI License, Bike RC Book, and Insurance Copy are STRICTLY MANDATORY upon scrutineering.'
        ],
        classes: [
          { id: 'c1', name: 'FOREIGN OPEN', fee: 1500, p1: 10000, p2: 6000, p3: 4000, p4: 'Medal', p5: 'Medal' },
          { id: 'c2', name: 'FOREIGN PVT.', fee: 1500, p1: 10000, p2: 6000, p3: 4000, p4: 'Medal', p5: 'Medal' },
          { id: 'c3', name: 'INDIAN BIKE UPTO 200 CC', fee: 1500, p1: 7000, p2: 5000, p3: 3000, p4: 'Medal', p5: 'Medal' },
          { id: 'c4', name: 'INDIAN BIKE 166-260', fee: 1500, p1: 7000, p2: 5000, p3: 3000, p4: 'Medal', p5: 'Medal' },
          { id: 'c5', name: 'INDIAN OPEN', fee: 1500, p1: 10000, p2: 6000, p3: 4000, p4: 'Medal', p5: 'Medal' },
          { id: 'c6', name: 'INDIAN BIKE 261-460', fee: 1500, p1: 7000, p2: 5000, p3: 3000, p4: 'Medal', p5: 'Medal' },
          { id: 'c7', name: 'RE CLASS OPEN', fee: 1500, p1: 7000, p2: 5000, p3: 3000, p4: 'Medal', p5: 'Medal' },
          { id: 'c8', name: 'VETERAN CLASS', fee: 1500, p1: 5000, p2: 3000, p3: 2000, p4: 'Medal', p5: 'Medal' },
          { id: 'c9', name: 'SCOOTER CLASS', fee: 1500, p1: 5000, p2: 3000, p3: 2000, p4: 'Medal', p5: 'Medal' },
          { id: 'c10', name: 'HERO CLASS', fee: 1500, p1: 5000, p2: 3000, p3: 2000, p4: 'Medal', p5: 'Medal' },
          { id: 'c11', name: 'JR CLASS 12-16 YRS.', fee: 1500, p1: 5000, p2: 3000, p3: 2000, p4: 'Medal', p5: 'Medal' },
          { id: 'c12', name: 'STOCK CLASS', fee: 1500, p1: 7000, p2: 5000, p3: 3000, p4: 'Medal', p5: 'Medal' },
          { id: 'c13', name: 'BEGINNER', fee: 1500, p1: 5000, p2: 3000, p3: 2000, p4: 'Medal', p5: 'Medal' },
          { id: 'c14', name: 'NOVICE', fee: 1500, p1: 5000, p2: 3000, p3: 2000, p4: 'Medal', p5: 'Medal' },
          { id: 'c15', name: 'INTERMEDIATE', fee: 1500, p1: 7000, p2: 5000, p3: 3000, p4: 'Medal', p5: 'Medal' },
          { id: 'c16', name: 'LADIES', fee: 1500, p1: 5000, p2: 3000, p3: 2000, p4: 'Medal', p5: 'Medal' },
          { id: 'c17', name: 'TWO STROKE', fee: 1500, p1: 7000, p2: 5000, p3: 3000, p4: 'Medal', p5: 'Medal' }
        ],
        createdAt: '2026-11-04T09:00:00.000Z'
      }
    ],
    registrations: [
      {
        id: 'reg_101',
        eventId: 'evt_deccan_conqueror_2',
        userId: 'usr_rider1',
        riderName: 'Pranav Thormise',
        riderPhone: '+91 98765 43210',
        riderEmail: 'pranav@racing.com',
        bikeModel: 'Kawasaki KX250 Motocross',
        competitionNumber: '97', // Number shown on flyer!
        classes: ['FOREIGN OPEN', 'INDIAN OPEN'],
        isChampionship: true,
        bikeSharing: false,
        fmsciLicenseNo: 'FMSCI-2026-MH-8492',
        hasRcBook: true,
        hasInsurance: true,
        totalFee: 3000,
        status: 'confirmed',
        qrTicket: 'DIRT-PUN-97-CONF',
        createdAt: '2026-11-07T14:20:00.000Z'
      },
      {
        id: 'reg_102',
        eventId: 'evt_deccan_conqueror_2',
        userId: 'usr_rider2',
        riderName: 'Kabir Deshmukh',
        riderPhone: '+91 98221 44556',
        riderEmail: 'kabir@throttlers.in',
        bikeModel: 'KTM 390 Adventure Rally spec',
        competitionNumber: '46',
        classes: ['INDIAN BIKE 261-460', 'INTERMEDIATE'],
        isChampionship: true,
        bikeSharing: false,
        fmsciLicenseNo: 'FMSCI-2026-MH-9102',
        hasRcBook: true,
        hasInsurance: true,
        totalFee: 3000,
        status: 'confirmed',
        qrTicket: 'DIRT-PUN-46-CONF',
        createdAt: '2026-11-08T09:15:00.000Z'
      },
      {
        id: 'reg_103',
        eventId: 'evt_deccan_conqueror_2',
        userId: 'usr_rider3',
        riderName: 'Sneha Kulkarni',
        riderPhone: '+91 98900 11223',
        riderEmail: 'sneha@motogirls.org',
        bikeModel: 'Yamaha RX100 2-Stroke Modified',
        competitionNumber: '11',
        classes: ['LADIES', 'TWO STROKE'],
        isChampionship: true,
        bikeSharing: false,
        fmsciLicenseNo: 'FMSCI-2026-MH-1120',
        hasRcBook: true,
        hasInsurance: true,
        totalFee: 3000,
        status: 'confirmed',
        qrTicket: 'DIRT-PUN-11-CONF',
        createdAt: '2026-11-08T16:45:00.000Z'
      },
      {
        id: 'reg_104',
        eventId: 'evt_deccan_conqueror_2',
        userId: 'usr_rider4',
        riderName: 'Arjun Rao',
        riderPhone: '+91 99233 44556',
        riderEmail: 'arjun@throttlepune.com',
        bikeModel: 'Hero Impulse 150 Special',
        competitionNumber: '07',
        classes: ['HERO CLASS', 'INDIAN BIKE UPTO 200 CC'],
        isChampionship: true,
        bikeSharing: false,
        fmsciLicenseNo: 'FMSCI-2026-MH-7070',
        hasRcBook: true,
        hasInsurance: true,
        totalFee: 3000,
        status: 'confirmed',
        qrTicket: 'DIRT-PUN-07-CONF',
        createdAt: '2026-11-09T11:00:00.000Z'
      },
      {
        id: 'reg_105',
        eventId: 'evt_deccan_conqueror_2',
        userId: 'usr_rider5',
        riderName: 'Farhan Patel',
        riderPhone: '+91 98111 22334',
        riderEmail: 'farhan@apexmx.com',
        bikeModel: 'Royal Enfield Himalayan 450',
        competitionNumber: '88',
        classes: ['RE CLASS OPEN', 'INDIAN BIKE 261-460'],
        isChampionship: true,
        bikeSharing: false,
        fmsciLicenseNo: 'FMSCI-2026-MH-8888',
        hasRcBook: true,
        hasInsurance: true,
        totalFee: 3000,
        status: 'confirmed',
        qrTicket: 'DIRT-PUN-88-CONF',
        createdAt: '2026-11-09T17:30:00.000Z'
      },
      {
        id: 'reg_106',
        eventId: 'evt_deccan_conqueror_2',
        userId: 'usr_rider6',
        riderName: 'Devansh Shinde',
        riderPhone: '+91 98333 44556',
        riderEmail: 'devansh@juniormx.in',
        bikeModel: 'Kawasaki KX65',
        competitionNumber: '23',
        classes: ['JR CLASS 12-16 YRS.', 'NOVICE'],
        isChampionship: true,
        bikeSharing: false,
        fmsciLicenseNo: 'FMSCI-2026-MH-2323',
        hasRcBook: true,
        hasInsurance: true,
        totalFee: 3000,
        status: 'confirmed',
        qrTicket: 'DIRT-PUN-23-CONF',
        createdAt: '2026-11-10T10:10:00.000Z'
      }
    ],
    transactions: [
      {
        id: 'tx_club_roadiez',
        userId: 'usr_roadiez',
        type: 'club_creation_fee',
        title: 'Roadiez Adventure Club Official Accreditation Fee',
        amount: 2999,
        status: 'completed',
        reference: 'DIRT-CLUB-RDZ-9821',
        createdAt: '2026-11-02T11:00:00.000Z'
      }
    ]
  };
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
      this.data = initial;
    } else {
      try {
        this.data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      } catch (err) {
        console.error('Error reading data.json, re-initializing', err);
        this.data = getInitialData();
        fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.warn('Could not persist data.json to disk (in-memory mode active):', err.message);
    }
  }

  // --- Duplicate Event Detection Logic ---
  checkDuplicateEvent(newEvent, excludeEventId = null) {
    const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const newNormTitle = normalize(newEvent.title);
    const newNormVenue = normalize(newEvent.venue);
    const newStartDate = newEvent.startDate;

    for (const evt of this.data.events) {
      if (excludeEventId && evt.id === excludeEventId) continue;
      if (evt.status === 'banned') continue;

      const normTitle = normalize(evt.title);
      const normVenue = normalize(evt.venue);
      const startDate = evt.startDate;

      // Check title similarity or exact venue + date match
      const titleMatches = newNormTitle.includes(normTitle) || normTitle.includes(newNormTitle);
      const venueAndDateMatch = normVenue && newNormVenue && (normVenue.includes(newNormVenue) || newNormVenue.includes(normVenue)) && startDate === newStartDate;

      if (titleMatches && venueAndDateMatch) {
        return {
          isDuplicate: true,
          matchedEventId: evt.id,
          matchedEventTitle: evt.title,
          reason: `A duplicate event titled "${evt.title}" at "${evt.venue}" on ${evt.startDate} is already registered on DirTrace.`
        };
      }

      // Strong title match even on near date
      if (titleMatches && (normVenue === newNormVenue || startDate === newStartDate)) {
        return {
          isDuplicate: true,
          matchedEventId: evt.id,
          matchedEventTitle: evt.title,
          reason: `High duplicate confidence with existing event "${evt.title}" (${evt.venue}, ${evt.startDate}).`
        };
      }
    }

    return { isDuplicate: false };
  }

  // --- Choice Number Availability Check ---
  isNumberTaken(eventId, compNumber) {
    const cleanNumber = String(compNumber).trim();
    return this.data.registrations.some(
      r => r.eventId === eventId && String(r.competitionNumber).trim() === cleanNumber && r.status === 'confirmed'
    );
  }

  getTakenNumbers(eventId) {
    return this.data.registrations
      .filter(r => r.eventId === eventId && r.status === 'confirmed')
      .map(r => String(r.competitionNumber).trim());
  }
}

module.exports = new Database();

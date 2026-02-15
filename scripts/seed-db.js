const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const BED_TYPE_IMAGES = [
    '/bed-types/single-study.svg',
    '/bed-types/twin-share.svg',
    '/bed-types/bunk-bed.svg',
    '/bed-types/small-double.svg',
];

const BED_TYPE_LABELS = [
    'Single Bed',
    'Twin Share',
    'Bunk Bed',
    'Small Double',
];

// Mirrors data from lib/mockData.js and maps it to the relational seed format.
const MOCK_HOSTELS = [
    {
        name: 'Zostel Mumbai',
        location: 'Mumbai, Maharashtra',
        description: 'Vibrant backpacker hostel in the heart of Mumbai. Close to the airport and major attractions.',
        rating: 4.8,
        amenities: ['Free WiFi', 'AC', 'Common Room', 'Cafe', 'Lockers'],
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'],
        gender: 'Co-ed',
        messAvailable: true,
    },
    {
        name: 'Student Pods Andheri',
        location: 'Mumbai, Maharashtra',
        description: 'Affordable student accommodation near Mumbai University. Quiet study zones and high-speed internet.',
        rating: 4.5,
        amenities: ['Study Room', 'WiFi', 'Laundry', 'Mess', '24/7 Security'],
        images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'],
        gender: 'Boys',
        messAvailable: true,
    },
    {
        name: 'The Backpackers Loft',
        location: 'Delhi, New Delhi',
        description: 'A cozy loft for travelers in Paharganj. Meet people from all over the world.',
        rating: 4.2,
        amenities: ['Rooftop', 'WiFi', 'Kitchen', 'Tours'],
        images: ['https://images.unsplash.com/photo-1520277739336-7bf67edfa768?auto=format&fit=crop&w=800&q=80'],
        gender: 'Co-ed',
        messAvailable: false,
    },
    {
        name: "Campus Hive Girl's Hostel",
        location: 'Pune, Maharashtra',
        description: 'Modern co-living space for female students. Near Symbiosis. Safe and secure.',
        rating: 4.9,
        amenities: ['Gym', 'Gaming Zone', 'AC', 'Meals Included', 'Biometric Entry'],
        images: ['https://images.unsplash.com/photo-1522771753037-6333616235df?auto=format&fit=crop&w=800&q=80'],
        gender: 'Girls',
        messAvailable: true,
    },
    {
        name: 'Goa Beach Hostel',
        location: 'Anjuna, Goa',
        description: 'Party hostel right on the beach. Good vibes only.',
        rating: 4.3,
        amenities: ['Bar', 'Pool', 'Beach Access', 'WiFi'],
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
        gender: 'Co-ed',
        messAvailable: true,
    },
    {
        name: "Scholar's Den",
        location: 'Bangalore, Karnataka',
        description: 'Dedicated housing for engineering students in Koramangala. 24/7 Library access.',
        rating: 4.0,
        amenities: ['Library', 'High-Speed WiFi', 'Mess', 'Shuttle Service'],
        images: ['https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80'],
        gender: 'Boys',
        messAvailable: true,
    },
    {
        name: 'Pink City Backpackers',
        location: 'Jaipur, Rajasthan',
        description: 'Traditional haveli turned into a social hostel. Rooftop yoga and chai.',
        rating: 4.7,
        amenities: ['Yoga', 'Rooftop Cafe', 'WiFi', 'Cultural Tours'],
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'],
        gender: 'Co-ed',
        messAvailable: true,
    },
    {
        name: 'SafeHaven Ladies PG',
        location: 'Mumbai, Maharashtra',
        description: 'Premium paying guest accommodation for working women and students in Bandra.',
        rating: 4.6,
        amenities: ['AC', 'Attached Washroom', 'Housekeeping', 'WiFi', 'Security'],
        images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'],
        gender: 'Girls',
        messAvailable: false,
    },
    {
        name: 'Himalayan Basecamp',
        location: 'Manali, Himachal Pradesh',
        description: 'For digital nomads and mountain lovers. Work with a view.',
        rating: 4.9,
        amenities: ['Heater', 'Co-working Space', 'Cafe', 'Bonfire'],
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'],
        gender: 'Co-ed',
        messAvailable: true,
    },
    {
        name: 'UniLiving Co-ed',
        location: 'Delhi, New Delhi',
        description: 'Modern cosmopolitan student living near North Campus.',
        rating: 4.1,
        amenities: ['Gym', 'Common Lounge', 'Mess', 'Laundry'],
        images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'],
        gender: 'Co-ed',
        messAvailable: true,
    },
    {
        name: 'TechHub Stay',
        location: 'Hyderabad, Telangana',
        description: 'Budget stay for interns and students in Hitech City.',
        rating: 3.8,
        amenities: ['WiFi', 'Power Backup', 'Mess', 'Parking'],
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'],
        gender: 'Boys',
        messAvailable: true,
    },
    {
        name: 'Kerala Backwaters Hostel',
        location: 'Alleppey, Kerala',
        description: 'Relax by the water. Canoeing and local food experiences.',
        rating: 4.5,
        amenities: ['Canoeing', 'Kitchen', 'WiFi', 'Hammocks'],
        images: ['https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80'],
        gender: 'Co-ed',
        messAvailable: true,
    },
];

function normalizeAmenity(amenity) {
    const value = String(amenity || '').trim();
    const lower = value.toLowerCase();

    if (lower.includes('wifi')) return 'WiFi';
    if (lower.includes('gym')) return 'Gym';
    if (lower.includes('library')) return 'Library';
    if (lower.includes('mess') || lower.includes('meal')) return 'Mess';
    if (lower.includes('security')) return 'Security';
    if (lower.includes('laundry')) return 'Laundry';
    if (lower.includes('ac')) return 'AC';
    if (lower.includes('cafe')) return 'Cafe';
    if (lower.includes('kitchen')) return 'Kitchen';
    if (lower.includes('study')) return 'Study Room';

    return value || 'General Facility';
}

function mapMockHostelToBlock(hostel, idx, wardenA, wardenB) {
    const totalRooms = 70 + (idx % 6) * 15; // 70, 85, 100...
    const occupancyRatio = 0.6 + (idx % 3) * 0.1; // 60-80%
    const occupiedRooms = Math.min(totalRooms - 1, Math.floor(totalRooms * occupancyRatio));
    const availableRooms = Math.max(1, totalRooms - occupiedRooms);
    const bedTypeLabel = BED_TYPE_LABELS[idx % BED_TYPE_LABELS.length];
    const bedTypeImage = BED_TYPE_IMAGES[idx % BED_TYPE_IMAGES.length];
    const facilities = Array.from(
        new Set([
            ...(hostel.amenities || []).map(normalizeAmenity),
            ...(hostel.messAvailable ? ['Mess'] : []),
            bedTypeLabel,
        ])
    );

    const normalizedName = /hall|hostel/i.test(hostel.name)
        ? hostel.name
        : `${hostel.name} Hall`;
    const normalizedDescription = `${hostel.description} Structured for university students with managed resident operations.`;

    return {
        name: normalizedName,
        type: ['Boys', 'Girls', 'Co-ed'].includes(hostel.gender) ? hostel.gender : 'Co-ed',
        desc: normalizedDescription,
        rooms: totalRooms,
        avail: availableRooms,
        loc: hostel.location,
        rating: hostel.rating || 4.0,
        warden: idx % 2 === 0 ? wardenA : wardenB,
        img: [bedTypeImage, ...((Array.isArray(hostel.images) && hostel.images.length > 0) ? hostel.images : [])],
        fac: facilities,
        status: 'Approved',
    };
}

async function seed() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Clean existing data
        await client.query('TRUNCATE communities, stories, complaints, notices, mess_menu, reviews, hostel_applications, students, hostel_blocks, users CASCADE');

        console.log('🌱 Seeding users and roles...');
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        // Create Admin
        await client.query(
            'INSERT INTO users (email, password, role, name, phone) VALUES ($1, $2, $3, $4, $5)',
            ['admin@hostelhub.com', password, 'Admin', 'Platform Admin', '9876543210']
        );

        // Create Wardens
        const warden1Res = await client.query(
            'INSERT INTO users (email, password, role, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            ['warden.a@example.com', password, 'Warden', 'Dr. Ramesh Kumar', '9876543211']
        );
        const warden2Res = await client.query(
            'INSERT INTO users (email, password, role, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            ['warden.b@example.com', password, 'Warden', 'Ms. Sneha Sharma', '9876543212']
        );

        // Create Students (Batch)
        const studentIds = [];
        const studentNames = ['Rahul Verma', 'Priya Singh', 'Amit Patel', 'Sneha Gupta', 'Vikram Malhotra', 'Anjali Desai'];

        for (let i = 0; i < studentNames.length; i++) {
            const res = await client.query(
                'INSERT INTO users (email, password, role, name, phone, can_access_dashboard) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                [`student${i + 1}@example.com`, password, 'Student', studentNames[i], `987654322${i}`, i < 3] // First 3 have dashboard access
            );
            studentIds.push(res.rows[0].id);
        }

        console.log('🌱 Seeding hostel blocks...');
        const blocksData = [
            {
                name: 'A Block - Boys Hostel',
                type: 'Boys',
                desc: 'Premium block with AC rooms, high-speed WiFi, and 24/7 power backup. Located near the sports complex.',
                rooms: 120, avail: 15, loc: 'North Campus', rating: 4.8, warden: warden1Res.rows[0].id,
                img: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5'],
                fac: ['WiFi', 'Gym', 'Laundry', 'AC', 'Sports'],
                status: 'Approved'
            },
            {
                name: 'B Block - Girls Hostel',
                type: 'Girls',
                desc: 'Secure and peaceful environment with lush green gardens and study halls.',
                rooms: 100, avail: 8, loc: 'West Zone', rating: 4.9, warden: warden2Res.rows[0].id,
                img: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf'],
                fac: ['WiFi', 'Library', 'Security', 'Green Campus', 'Shuttle'],
                status: 'Pending'
            },
            {
                name: 'C Block - International',
                type: 'Co-ed',
                desc: 'State-of-the-art facilities for international students with single occupancy rooms.',
                rooms: 50, avail: 45, loc: 'International Wing', rating: 4.7, warden: warden1Res.rows[0].id,
                img: ['https://images.unsplash.com/photo-1512918760532-3ed465901853'],
                fac: ['WiFi', 'AC', 'Single Room', 'Swimming Pool'],
                status: 'Approved'
            },
            {
                name: 'D Block - Budget',
                type: 'Boys',
                desc: 'Affordable accommodation with essential amenities and proximity to the main canteen.',
                rooms: 200, avail: 0, loc: 'South Campus', rating: 4.2, warden: warden1Res.rows[0].id,
                img: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'],
                fac: ['WiFi', 'Mess', 'Common Room'],
                status: 'Rejected'
            },
            ...MOCK_HOSTELS.map((h, idx) =>
                mapMockHostelToBlock(h, idx, warden1Res.rows[0].id, warden2Res.rows[0].id)
            ),
        ];

        const blockIds = [];
        for (const b of blocksData) {
            const res = await client.query(
                `INSERT INTO hostel_blocks (block_name, type, description, total_rooms, available_rooms, occupied_rooms, location, rating, warden_user_id, images, facilities, approval_status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
                [b.name, b.type, b.desc, b.rooms, b.avail, b.rooms - b.avail, b.loc, b.rating, b.warden, b.img, b.fac, b.status]
            );
            blockIds.push(res.rows[0].id);
        }

        console.log('🌱 Seeding students details...');
        // Enroll detailed students
        await client.query(
            'INSERT INTO students (user_id, roll_number, course, year, department, hostel_block_id, room_number, enrollment_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [studentIds[0], 'CS2023001', 'B.Tech CSE', 3, 'Computer Science', blockIds[0], '302', 'Accepted']
        );
        await client.query(
            'INSERT INTO students (user_id, roll_number, course, year, department, hostel_block_id, room_number, enrollment_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [studentIds[1], 'EC2023045', 'B.Tech ECE', 2, 'Electronics', blockIds[1], '105', 'Accepted']
        );
        // Pending Application
        await client.query(
            'INSERT INTO students (user_id, roll_number, course, year, department, enrollment_status) VALUES ($1, $2, $3, $4, $5, $6)',
            [studentIds[2], 'ME2023012', 'B.Tech Mech', 2, 'Mechanical', 'Applied']
        );
        // Create an application for the pending student
        await client.query(
            `INSERT INTO hostel_applications (student_id, hostel_block_id, status, application_data) 
             VALUES ((SELECT id FROM students WHERE user_id = $1), $2, 'Pending', $3)`,
            [studentIds[2], blockIds[0], { preferredRoomType: 'Double Share' }]
        );


        console.log('🌱 Seeding reviews and notices...');
        const reviews = [
            { sIdx: 0, bIdx: 0, rate: 5, text: 'Amazing facilities! The gym is top-notch.' },
            { sIdx: 1, bIdx: 0, rate: 4, text: 'Great food but WiFi is spotty sometimes.' },
            { sIdx: 4, bIdx: 1, rate: 5, text: 'Very safe and clean. Warden is helpful.' },
            { sIdx: 5, bIdx: 3, rate: 3, text: 'Good for the price, but rooms are small.' }
        ];

        // Need student profile IDs for reviews
        for (const rev of reviews) {
            // Check if student profile exists, create if not for review sake
            let sRes = await client.query('SELECT id FROM students WHERE user_id = $1', [studentIds[rev.sIdx]]);
            let sId = sRes.rows[0]?.id;

            if (!sId) {
                const res = await client.query(
                    'INSERT INTO students (user_id, roll_number, enrollment_status) VALUES ($1, $2, $3) RETURNING id',
                    [studentIds[rev.sIdx], `GEN${rev.sIdx}`, 'Enrolled']
                );
                sId = res.rows[0].id;
            }

            await client.query(
                'INSERT INTO reviews (student_id, hostel_block_id, rating, review_text) VALUES ($1, $2, $3, $4)',
                [sId, blockIds[rev.bIdx], rev.rate, rev.text]
            );
        }

        // Notices
        for (const bId of blockIds) {
            await client.query(
                'INSERT INTO notices (hostel_block_id, title, content, priority) VALUES ($1, $2, $3, $4)',
                [bId, 'Water Supply Maintenance', 'Water supply will be affected on Sunday 10am-2pm.', 'High']
            );
            await client.query(
                'INSERT INTO notices (hostel_block_id, title, content, priority) VALUES ($1, $2, $3, $4)',
                [bId, 'Annual Sports Meet', 'Register for the hostel football team by Friday.', 'Low']
            );
        }

        console.log('🌱 Seeding mess menu...');
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const menuVariations = [
            { b: 'Poha + Tea', l: 'Rajma Rice', s: 'Biscuits', d: 'Roti + Paneer' },
            { b: 'Aloo Paratha', l: 'Chole Bhature', s: 'Samosa', d: 'Mix Veg + Dal' },
            { b: 'Idli Sambar', l: 'Curd Rice', s: 'Banana', d: 'Biryani' }
        ];

        for (const bId of blockIds) {
            for (let i = 0; i < days.length; i++) {
                const menu = menuVariations[i % 3];
                await client.query(
                    'INSERT INTO mess_menu (hostel_block_id, day, breakfast, lunch, snacks, dinner) VALUES ($1, $2, $3, $4, $5, $6)',
                    [bId, days[i], menu.b, menu.l, menu.s, menu.d]
                );
            }
        }

        await client.query('COMMIT');
        console.log('✅ Database seeded successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.log('❌ Error seeding database:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();

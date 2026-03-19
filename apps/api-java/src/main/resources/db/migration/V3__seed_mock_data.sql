INSERT INTO users (id, email, password, role, name, phone, can_access_dashboard, is_active)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@hostelhub.local', crypt('Password123!', gen_salt('bf')), 'Admin', 'Aarav Mehta', '9876500001', true, true),
    ('22222222-2222-2222-2222-222222222221', 'warden.north@hostelhub.local', crypt('Password123!', gen_salt('bf')), 'Warden', 'Neha Kapoor', '9876500002', true, true),
    ('22222222-2222-2222-2222-222222222222', 'warden.central@hostelhub.local', crypt('Password123!', gen_salt('bf')), 'Warden', 'Rohit Sinha', '9876500003', true, true),
    ('33333333-3333-3333-3333-333333333331', 'student.riya@hostelhub.local', crypt('Password123!', gen_salt('bf')), 'Student', 'Riya Sharma', '9876500011', true, true),
    ('33333333-3333-3333-3333-333333333332', 'student.arjun@hostelhub.local', crypt('Password123!', gen_salt('bf')), 'Student', 'Arjun Patel', '9876500012', true, true),
    ('33333333-3333-3333-3333-333333333333', 'student.sana@hostelhub.local', crypt('Password123!', gen_salt('bf')), 'Student', 'Sana Khan', '9876500013', false, true)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    can_access_dashboard = EXCLUDED.can_access_dashboard,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

INSERT INTO hostel_blocks (
    id, block_name, type, description, total_rooms, available_rooms, occupied_rooms,
    location, rating, virtual_tour_url, images, facilities, latitude, longitude,
    warden_user_id, approval_status
)
VALUES
    (
        '44444444-4444-4444-4444-444444444441',
        'North Campus Heights',
        'Girls',
        'A premium girls hostel with quiet study floors, biometric entry, and a rooftop common lounge.',
        48,
        12,
        36,
        'Delhi University North Campus',
        4.8,
        'https://example.com/tours/north-campus-heights',
        ARRAY[
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
        ],
        ARRAY['WiFi', 'Library', 'Mess', 'Laundry', 'Security'],
        28.687200,
        77.209000,
        '22222222-2222-2222-2222-222222222221',
        'Approved'
    ),
    (
        '44444444-4444-4444-4444-444444444442',
        'Central Residency Hub',
        'Co-ed',
        'Balanced co-ed accommodation for internships and semester housing with a gym, reading pods, and shuttle support.',
        64,
        18,
        46,
        'Connaught Place, New Delhi',
        4.5,
        'https://example.com/tours/central-residency-hub',
        ARRAY[
            'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ],
        ARRAY['WiFi', 'Gym', 'Mess', 'Laundry', 'Sports'],
        28.631500,
        77.216700,
        '22222222-2222-2222-2222-222222222222',
        'Approved'
    ),
    (
        '44444444-4444-4444-4444-444444444443',
        'Scholars Corner',
        'Boys',
        'Academic-first residence focused on engineering students, with extended study halls and a coding lab.',
        40,
        9,
        31,
        'Noida Sector 62',
        4.6,
        'https://example.com/tours/scholars-corner',
        ARRAY[
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
        ],
        ARRAY['WiFi', 'Library', 'Gym', 'Mess', 'Laundry'],
        28.628900,
        77.364900,
        '22222222-2222-2222-2222-222222222222',
        'Approved'
    )
ON CONFLICT (id) DO UPDATE SET
    block_name = EXCLUDED.block_name,
    type = EXCLUDED.type,
    description = EXCLUDED.description,
    total_rooms = EXCLUDED.total_rooms,
    available_rooms = EXCLUDED.available_rooms,
    occupied_rooms = EXCLUDED.occupied_rooms,
    location = EXCLUDED.location,
    rating = EXCLUDED.rating,
    virtual_tour_url = EXCLUDED.virtual_tour_url,
    images = EXCLUDED.images,
    facilities = EXCLUDED.facilities,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    warden_user_id = EXCLUDED.warden_user_id,
    approval_status = EXCLUDED.approval_status,
    updated_at = NOW();

INSERT INTO students (
    id, user_id, roll_number, course, year, department, hostel_block_id, room_number, enrollment_status, photo
)
VALUES
    (
        '55555555-5555-5555-5555-555555555551',
        '33333333-3333-3333-3333-333333333331',
        'DU-CS-2401',
        'B.Tech',
        3,
        'Computer Science',
        '44444444-4444-4444-4444-444444444441',
        'A-203',
        'Active',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=riya'
    ),
    (
        '55555555-5555-5555-5555-555555555552',
        '33333333-3333-3333-3333-333333333332',
        'DU-MBA-2417',
        'MBA',
        2,
        'Management',
        '44444444-4444-4444-4444-444444444442',
        'C-110',
        'Active',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun'
    ),
    (
        '55555555-5555-5555-5555-555555555553',
        '33333333-3333-3333-3333-333333333333',
        'DU-ARC-2422',
        'B.Arch',
        1,
        'Architecture',
        NULL,
        NULL,
        'Applied',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=sana'
    )
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    roll_number = EXCLUDED.roll_number,
    course = EXCLUDED.course,
    year = EXCLUDED.year,
    department = EXCLUDED.department,
    hostel_block_id = EXCLUDED.hostel_block_id,
    room_number = EXCLUDED.room_number,
    enrollment_status = EXCLUDED.enrollment_status,
    photo = EXCLUDED.photo,
    updated_at = NOW();

INSERT INTO hostel_applications (
    id, student_id, hostel_block_id, status, application_data, reviewed_by, reviewed_date, notes, created_at
)
VALUES
    (
        '66666666-6666-6666-6666-666666666661',
        '55555555-5555-5555-5555-555555555551',
        '44444444-4444-4444-4444-444444444441',
        'Accepted',
        '{"preferredRoomType":"Double Share","moveInDate":"2026-03-01","guardianApproved":true}'::jsonb,
        '22222222-2222-2222-2222-222222222221',
        NOW() - INTERVAL '20 days',
        'Verified academic documents and fee clearance.',
        NOW() - INTERVAL '25 days'
    ),
    (
        '66666666-6666-6666-6666-666666666662',
        '55555555-5555-5555-5555-555555555552',
        '44444444-4444-4444-4444-444444444442',
        'Accepted',
        '{"preferredRoomType":"Single","moveInDate":"2026-02-20","guardianApproved":true}'::jsonb,
        '22222222-2222-2222-2222-222222222222',
        NOW() - INTERVAL '30 days',
        'Placed in central residency after orientation week.',
        NOW() - INTERVAL '34 days'
    ),
    (
        '66666666-6666-6666-6666-666666666663',
        '55555555-5555-5555-5555-555555555553',
        '44444444-4444-4444-4444-444444444443',
        'Pending',
        '{"preferredRoomType":"Double Share","moveInDate":"2026-04-05","guardianApproved":false}'::jsonb,
        NULL,
        NULL,
        'Awaiting document verification and fee confirmation.',
        NOW() - INTERVAL '2 days'
    )
ON CONFLICT (id) DO UPDATE SET
    student_id = EXCLUDED.student_id,
    hostel_block_id = EXCLUDED.hostel_block_id,
    status = EXCLUDED.status,
    application_data = EXCLUDED.application_data,
    reviewed_by = EXCLUDED.reviewed_by,
    reviewed_date = EXCLUDED.reviewed_date,
    notes = EXCLUDED.notes;

INSERT INTO reviews (id, student_id, hostel_block_id, rating, review_text, helpful, created_at)
VALUES
    (
        '77777777-7777-7777-7777-777777777771',
        '55555555-5555-5555-5555-555555555551',
        '44444444-4444-4444-4444-444444444441',
        5,
        'The study rooms stay quiet even during exams and the security team is genuinely helpful.',
        18,
        NOW() - INTERVAL '10 days'
    ),
    (
        '77777777-7777-7777-7777-777777777772',
        '55555555-5555-5555-5555-555555555552',
        '44444444-4444-4444-4444-444444444442',
        4,
        'Great location for interns and the gym is better than most private hostels nearby.',
        11,
        NOW() - INTERVAL '7 days'
    )
ON CONFLICT (id) DO UPDATE SET
    student_id = EXCLUDED.student_id,
    hostel_block_id = EXCLUDED.hostel_block_id,
    rating = EXCLUDED.rating,
    review_text = EXCLUDED.review_text,
    helpful = EXCLUDED.helpful;

INSERT INTO hostel_comments (id, hostel_block_id, user_id, user_type, comment_text, parent_id, created_at)
VALUES
    (
        '88888888-8888-8888-8888-888888888881',
        '44444444-4444-4444-4444-444444444441',
        '33333333-3333-3333-3333-333333333331',
        'Student',
        'How strict is the in-time policy during placement season?',
        NULL,
        NOW() - INTERVAL '4 days'
    ),
    (
        '88888888-8888-8888-8888-888888888882',
        '44444444-4444-4444-4444-444444444441',
        '22222222-2222-2222-2222-222222222221',
        'Warden',
        'Extended entry can be approved with an official training or placement letter.',
        '88888888-8888-8888-8888-888888888881',
        NOW() - INTERVAL '3 days'
    )
ON CONFLICT (id) DO UPDATE SET
    comment_text = EXCLUDED.comment_text,
    parent_id = EXCLUDED.parent_id;

INSERT INTO complaints (
    id, student_id, title, description, status, assigned_to, assigned_at, eta, updated_at, resolved_at, resolution_notes, resolution_photos, created_at
)
VALUES
    (
        '99999999-9999-9999-9999-999999999991',
        '55555555-5555-5555-5555-555555555551',
        'Water dispenser issue',
        'The dispenser on floor 2 stops cooling after 8 PM and needs maintenance.',
        'In Progress',
        '22222222-2222-2222-2222-222222222221',
        NOW() - INTERVAL '1 day',
        NOW() + INTERVAL '1 day',
        NOW() - INTERVAL '1 hour',
        NULL,
        NULL,
        ARRAY[]::TEXT[],
        NOW() - INTERVAL '2 days'
    ),
    (
        '99999999-9999-9999-9999-999999999992',
        '55555555-5555-5555-5555-555555555552',
        'Laundry token mismatch',
        'Two laundry cycles were deducted but only one machine started.',
        'Resolved',
        '22222222-2222-2222-2222-222222222222',
        NOW() - INTERVAL '6 days',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '4 days',
        NOW() - INTERVAL '4 days',
        'Balance was restored and machine 3 was recalibrated.',
        ARRAY['https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80'],
        NOW() - INTERVAL '7 days'
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    assigned_to = EXCLUDED.assigned_to,
    assigned_at = EXCLUDED.assigned_at,
    eta = EXCLUDED.eta,
    updated_at = EXCLUDED.updated_at,
    resolved_at = EXCLUDED.resolved_at,
    resolution_notes = EXCLUDED.resolution_notes,
    resolution_photos = EXCLUDED.resolution_photos;

INSERT INTO notices (id, hostel_block_id, title, content, priority, expires_at, created_at, updated_at)
VALUES
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        '44444444-4444-4444-4444-444444444441',
        'Exam Week Quiet Hours',
        'Quiet hours will begin at 9 PM for all academic blocks from Monday to Friday this week.',
        'High',
        NOW() + INTERVAL '5 days',
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '1 day'
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
        '44444444-4444-4444-4444-444444444442',
        'Mess Feedback Townhall',
        'Resident feedback session with the catering team is scheduled in the common room on Saturday evening.',
        'Normal',
        NOW() + INTERVAL '10 days',
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '3 days'
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
        NULL,
        'Emergency Drill Notice',
        'A campus-wide emergency response drill will be held tomorrow at 5 PM. Follow the floor captain instructions.',
        'Urgent',
        NOW() + INTERVAL '1 day',
        NOW() - INTERVAL '2 hours',
        NOW() - INTERVAL '2 hours'
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    priority = EXCLUDED.priority,
    expires_at = EXCLUDED.expires_at,
    updated_at = EXCLUDED.updated_at;

INSERT INTO notice_acknowledgements (id, notice_id, student_id, acknowledged_at)
VALUES
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        '55555555-5555-5555-5555-555555555551',
        NOW() - INTERVAL '12 hours'
    )
ON CONFLICT (notice_id, student_id) DO UPDATE SET
    acknowledged_at = EXCLUDED.acknowledged_at;

INSERT INTO mess_menu (
    id, hostel_block_id, day, breakfast, lunch, snacks, dinner,
    breakfast_up, breakfast_down, lunch_up, lunch_down, snacks_up, snacks_down, dinner_up, dinner_down
)
VALUES
    ('cccccccc-cccc-cccc-cccc-ccccccccccc1', '44444444-4444-4444-4444-444444444441', 'Monday', 'Poha, Tea, Fruit Bowl', 'Dal Tadka, Jeera Rice, Paneer Sabzi', 'Tea, Biscuits', 'Chapati, Rajma, Salad', 31, 2, 28, 3, 18, 1, 33, 4),
    ('cccccccc-cccc-cccc-cccc-ccccccccccc2', '44444444-4444-4444-4444-444444444441', 'Tuesday', 'Idli, Sambar, Coffee', 'Veg Pulao, Raita, Mix Veg', 'Corn Chaat', 'Chapati, Chole, Halwa', 30, 1, 27, 2, 14, 1, 32, 3),
    ('cccccccc-cccc-cccc-cccc-ccccccccccc3', '44444444-4444-4444-4444-444444444441', 'Wednesday', 'Aloo Paratha, Curd', 'Dal Makhani, Rice, Salad', 'Milkshake, Sandwich', 'Chapati, Kofta, Kheer', 34, 2, 29, 2, 19, 2, 35, 3),
    ('cccccccc-cccc-cccc-cccc-ccccccccccc4', '44444444-4444-4444-4444-444444444441', 'Thursday', 'Upma, Tea, Banana', 'Sambar Rice, Beetroot Fry', 'Bhel, Lemonade', 'Chapati, Veg Kurma, Rice', 29, 2, 26, 3, 17, 1, 31, 2),
    ('cccccccc-cccc-cccc-cccc-ccccccccccc5', '44444444-4444-4444-4444-444444444441', 'Friday', 'Dosa, Chutney, Coffee', 'Paneer Butter Masala, Rice', 'Sprouts Chaat', 'Chapati, Dal Fry, Gulab Jamun', 35, 2, 30, 4, 16, 2, 34, 5),
    ('cccccccc-cccc-cccc-cccc-ccccccccccc6', '44444444-4444-4444-4444-444444444441', 'Saturday', 'Puri Bhaji, Tea', 'Kadhi Chawal, Aloo Beans', 'Samosa, Tea', 'Chapati, Mix Veg, Custard', 33, 3, 25, 3, 22, 2, 30, 3),
    ('cccccccc-cccc-cccc-cccc-ccccccccccc7', '44444444-4444-4444-4444-444444444441', 'Sunday', 'Pancakes, Milk, Fruit', 'Veg Biryani, Raita', 'Cold Coffee, Cookies', 'Chapati, Dal, Chicken-style Soy Curry', 36, 3, 32, 4, 24, 2, 37, 4)
ON CONFLICT (id) DO UPDATE SET
    breakfast = EXCLUDED.breakfast,
    lunch = EXCLUDED.lunch,
    snacks = EXCLUDED.snacks,
    dinner = EXCLUDED.dinner,
    breakfast_up = EXCLUDED.breakfast_up,
    breakfast_down = EXCLUDED.breakfast_down,
    lunch_up = EXCLUDED.lunch_up,
    lunch_down = EXCLUDED.lunch_down,
    snacks_up = EXCLUDED.snacks_up,
    snacks_down = EXCLUDED.snacks_down,
    dinner_up = EXCLUDED.dinner_up,
    dinner_down = EXCLUDED.dinner_down;

INSERT INTO stories (id, user_id, title, content, image, tags, created_at)
VALUES
    (
        'dddddddd-dddd-dddd-dddd-ddddddddddd1',
        '33333333-3333-3333-3333-333333333331',
        'How I settled into North Campus in two weeks',
        'A short guide for new residents on managing documents, study schedules, and roommate expectations during the first fortnight.',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
        ARRAY['student-life', 'onboarding'],
        NOW() - INTERVAL '5 days'
    ),
    (
        'dddddddd-dddd-dddd-dddd-ddddddddddd2',
        '22222222-2222-2222-2222-222222222221',
        'Warden checklist for exam season',
        'Operational checklist covering quiet hours, water availability, and visitor control for a smooth exam week.',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        ARRAY['operations', 'exam-week'],
        NOW() - INTERVAL '3 days'
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    image = EXCLUDED.image,
    tags = EXCLUDED.tags;

INSERT INTO communities (id, name, description, member_count, image, created_at)
VALUES
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
        'Night Owls Study Circle',
        'Late-evening peer study group for exam prep, interview practice, and assignment reviews.',
        84,
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        NOW() - INTERVAL '20 days'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2',
        'Hostel Fitness Collective',
        'Residents coordinating shared workout plans, step challenges, and weekend sports matches.',
        59,
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
        NOW() - INTERVAL '15 days'
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    member_count = EXCLUDED.member_count,
    image = EXCLUDED.image;

INSERT INTO bookings (id, student_id, hostel_block_id, check_in, check_out, status, amount, created_at)
VALUES
    (
        'ffffffff-ffff-ffff-ffff-fffffffffff1',
        '55555555-5555-5555-5555-555555555551',
        '44444444-4444-4444-4444-444444444441',
        CURRENT_DATE - 25,
        CURRENT_DATE + 95,
        'Confirmed',
        48500.00,
        NOW() - INTERVAL '26 days'
    ),
    (
        'ffffffff-ffff-ffff-ffff-fffffffffff2',
        '55555555-5555-5555-5555-555555555552',
        '44444444-4444-4444-4444-444444444442',
        CURRENT_DATE - 35,
        CURRENT_DATE + 85,
        'Confirmed',
        51200.00,
        NOW() - INTERVAL '36 days'
    )
ON CONFLICT (id) DO UPDATE SET
    student_id = EXCLUDED.student_id,
    hostel_block_id = EXCLUDED.hostel_block_id,
    check_in = EXCLUDED.check_in,
    check_out = EXCLUDED.check_out,
    status = EXCLUDED.status,
    amount = EXCLUDED.amount;

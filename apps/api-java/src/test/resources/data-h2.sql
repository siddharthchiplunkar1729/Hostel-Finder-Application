INSERT INTO users (id, email, password, role, name, phone, can_access_dashboard, is_active, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'warden@example.com',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOaW9GZb3vGn9GZm4G6dkprdFM5lTyBC6',
    'Warden',
    'Test Warden',
    '9999999999',
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO hostel_blocks (
    id,
    block_name,
    type,
    description,
    total_rooms,
    available_rooms,
    occupied_rooms,
    location,
    rating,
    virtual_tour_url,
    images,
    facilities,
    latitude,
    longitude,
    warden_user_id,
    approval_status,
    created_at,
    updated_at
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'North Block',
    'Boys',
    'Sample hostel block for smoke tests',
    120,
    24,
    96,
    'Campus North',
    4.2,
    NULL,
    ARRAY['north-1.jpg'],
    ARRAY['Wifi', 'Mess'],
    12.971600,
    77.594600,
    '11111111-1111-1111-1111-111111111111',
    'Approved',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO communities (id, name, description, member_count, image, created_at)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'Hostel Sports Club',
    'Community for sports enthusiasts',
    42,
    'sports.jpg',
    CURRENT_TIMESTAMP
);

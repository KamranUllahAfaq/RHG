import { prisma } from './db';

let seedingPromise: Promise<void> | null = null;

export async function seedDatabaseIfNeeded() {
  // Check if we already have students. If yes, no need to seed.
  try {
    const studentCount = await prisma.student.count();
    if (studentCount > 0) {
      return;
    }
  } catch (err) {
    console.error('Error checking student count, database might not be ready or url is invalid:', err);
    return;
  }

  // To prevent concurrent seeding executions
  if (seedingPromise) {
    return seedingPromise;
  }

  seedingPromise = (async () => {
    console.log('Database is empty. Starting auto-seed...');
    try {
      // Clear existing entries just to be clean
      await prisma.transportRoute.deleteMany();
      await prisma.notification.deleteMany();
      await prisma.complaint.deleteMany();
      await prisma.payment.deleteMany();
      await prisma.roommate.deleteMany();
      await prisma.student.deleteMany();
      await prisma.warden.deleteMany();
      await prisma.staff.deleteMany();
      await prisma.room.deleteMany();
      await prisma.branch.deleteMany();

      // 1. Create 20 Branches
      const branches = [];
      for (let i = 1; i <= 20; i++) {
        const isGirls = i <= 10;
        const branch = await prisma.branch.create({
          data: {
            name: `Branch ${i}`,
            type: isGirls ? 'Girls' : 'Boys',
          },
        });
        branches.push(branch);
      }
      console.log('Created 20 branches.');

      // 2. Create Rooms for all branches
      const roomData = [
        { roomNumber: '101', floor: '1st Floor', roomType: 'Double', totalBeds: 2 },
        { roomNumber: '102', floor: '1st Floor', roomType: 'Quad', totalBeds: 4 },
        { roomNumber: '201', floor: '2nd Floor', roomType: 'Double', totalBeds: 2 },
        { roomNumber: '202', floor: '2nd Floor', roomType: 'Quad', totalBeds: 4 },
        { roomNumber: '301', floor: '3rd Floor', roomType: 'Single', totalBeds: 1 },
        { roomNumber: '302', floor: '3rd Floor', roomType: 'Double', totalBeds: 2 },
      ];

      const studentRooms = [
        { branchIndex: 2, roomNumber: 'B3-204', floor: '2nd Floor', roomType: 'Quad', totalBeds: 4 }, // Branch 3
        { branchIndex: 4, roomNumber: 'B5-112', floor: '1st Floor', roomType: 'Double', totalBeds: 2 }, // Branch 5
        { branchIndex: 1, roomNumber: 'B2-301', floor: '3rd Floor', roomType: 'Single', totalBeds: 1 }, // Branch 2
        { branchIndex: 7, roomNumber: 'B8-110', floor: '1st Floor', roomType: 'Double', totalBeds: 2 }, // Branch 8
        { branchIndex: 11, roomNumber: 'B12-215', floor: '2nd Floor', roomType: 'Double', totalBeds: 2 }, // Branch 12
        { branchIndex: 10, roomNumber: 'B11-302', floor: '3rd Floor', roomType: 'Double', totalBeds: 2 }, // Branch 11
      ];

      const dbRooms: { [key: string]: any } = {};

      for (let bIndex = 0; bIndex < branches.length; bIndex++) {
        const branch = branches[bIndex];
        for (const r of roomData) {
          const room = await prisma.room.create({
            data: {
              roomNumber: `R-${r.roomNumber}`,
              floor: r.floor,
              roomType: r.roomType,
              totalBeds: r.totalBeds,
              branchId: branch.id,
            },
          });
          dbRooms[`${branch.name}-R-${r.roomNumber}`] = room;
        }
      }

      for (const sr of studentRooms) {
        const branch = branches[sr.branchIndex];
        const room = await prisma.room.create({
          data: {
            roomNumber: sr.roomNumber,
            floor: sr.floor,
            roomType: sr.roomType,
            totalBeds: sr.totalBeds,
            branchId: branch.id,
          },
        });
        dbRooms[`${branch.name}-${sr.roomNumber}`] = room;
      }
      console.log('Created rooms.');

      // 3. Create Wardens (2 per branch)
      for (let b = 0; b < branches.length; b++) {
        const branch = branches[b];
        await prisma.warden.create({
          data: {
            name: `Warden ${branch.name} A`,
            contact: `+92 312 9000${b}1`,
            email: `warden.a.b${b + 1}@royalhostels.pk`,
            shift: 'Day',
            salary: 45000.0,
            assignedFloor: '1st & 2nd Floor',
            branchId: branch.id,
          },
        });
        await prisma.warden.create({
          data: {
            name: `Warden ${branch.name} B`,
            contact: `+92 312 9000${b}2`,
            email: `warden.b.b${b + 1}@royalhostels.pk`,
            shift: 'Night',
            salary: 48000.0,
            assignedFloor: '3rd Floor',
            branchId: branch.id,
          },
        });
      }
      console.log('Created wardens.');

      // 4. Create Staff members (6 per branch)
      const categories = [
        { cat: 'Mess Staff', role: 'Cook', salary: 35000.0 },
        { cat: 'Mess Staff', role: 'Food Server', salary: 22000.0 },
        { cat: 'Working Maid', role: 'Maid', salary: 20000.0 },
        { cat: 'Sanitary Staff', role: 'Sweeper', salary: 18000.0 },
        { cat: 'Security Guard', role: 'Guard', salary: 28000.0 },
        { cat: 'Maintenance Staff', role: 'Electrician', salary: 30000.0 },
      ];
      for (let b = 0; b < branches.length; b++) {
        const branch = branches[b];
        for (let cIdx = 0; cIdx < categories.length; cIdx++) {
          const c = categories[cIdx];
          await prisma.staff.create({
            data: {
              name: `${c.role} Employee ${b + 1}-${cIdx + 1}`,
              category: c.cat,
              role: c.role,
              contact: `+92 333 8000${b}${cIdx}`,
              salary: c.salary,
              dutyArea: c.cat === 'Mess Staff' ? 'Kitchen/Mess' : 'Common Areas',
              shift: cIdx % 2 === 0 ? 'Day' : 'Night',
              joiningDate: '01-01-2025',
              branchId: branch.id,
            },
          });
        }
      }
      console.log('Created staff.');

      // 5. Create Students
      const studentsToSeed = [
        {
          username: 'ahmed',
          name: 'Ahmed Khan',
          fatherName: 'Naseer Khan',
          cnic: '37405-1234567-1',
          permanentAddress: 'House 12, Street 3, G-9, Islamabad',
          semester: '6th',
          registrationNumber: 'CIIT/FA21-BCS-010/ISB',
          university: 'COMSATS',
          email: 'ahmed.khan@gmail.com',
          rollNumber: 'FA21-BCS-010',
          hostelName: 'Branch 3',
          roomNumber: 'B3-204',
          mobile: '+92 300 9876541',
          emergencyContact: '+92 312 4445551',
          monthlyFee: 25000.0,
          balanceDue: 10000.0,
          fine: 0.0,
          transportUsing: false,
          branchName: 'Branch 3',
        },
        {
          username: 'ali',
          name: 'Ali Raza',
          fatherName: 'Muhammad Raza',
          cnic: '37405-2345678-2',
          permanentAddress: 'Samanabad, Lahore',
          semester: '4th',
          registrationNumber: 'IQRA-2023-982',
          university: 'IQRA University',
          email: 'ali.raza@gmail.com',
          rollNumber: 'IQRA-2023-982',
          hostelName: 'Branch 5',
          roomNumber: 'B5-112',
          mobile: '+92 300 9876542',
          emergencyContact: '+92 312 4445552',
          monthlyFee: 25000.0,
          balanceDue: 0.0,
          fine: 0.0,
          transportUsing: true,
          branchName: 'Branch 5',
        },
        {
          username: 'hamza',
          name: 'Hamza Malik',
          fatherName: 'Kashif Malik',
          cnic: '37405-3456789-3',
          permanentAddress: 'Model Town, Multan',
          semester: '8th',
          registrationNumber: 'ABA-FA20-SE-055',
          university: 'ABASYN University',
          email: 'hamza.malik@gmail.com',
          rollNumber: 'ABA-FA20-SE-055',
          hostelName: 'Branch 2',
          roomNumber: 'B2-301',
          mobile: '+92 300 9876543',
          emergencyContact: '+92 312 4445553',
          monthlyFee: 25000.0,
          balanceDue: 25000.0,
          fine: 1000.0,
          transportUsing: false,
          branchName: 'Branch 2',
        },
        {
          username: 'usman',
          name: 'Usman Tariq',
          fatherName: 'Tariq Mahmood',
          cnic: '37405-4567890-4',
          permanentAddress: 'Gulgasht, Multan',
          semester: '2nd',
          registrationNumber: 'SHIFA-2025-081',
          university: 'SHIFA',
          email: 'usman.tariq@gmail.com',
          rollNumber: 'SHIFA-2025-081',
          hostelName: 'Branch 8',
          roomNumber: 'B8-110',
          mobile: '+92 300 9876544',
          emergencyContact: '+92 312 4445554',
          monthlyFee: 25000.0,
          balanceDue: 25000.0,
          fine: 0.0,
          transportUsing: true,
          branchName: 'Branch 8',
        },
        {
          username: 'bilal',
          name: 'Bilal Ahmad',
          fatherName: 'Zubair Ahmad',
          cnic: '37405-5678901-5',
          permanentAddress: 'Sector F-11, Islamabad',
          semester: '5th',
          registrationNumber: 'KMU-2022-771',
          university: 'KMU',
          email: 'bilal.ahmad@gmail.com',
          rollNumber: 'KMU-2022-771',
          hostelName: 'Branch 12',
          roomNumber: 'B12-215',
          mobile: '+92 300 9876545',
          emergencyContact: '+92 312 4445555',
          monthlyFee: 25000.0,
          balanceDue: 0.0,
          fine: 0.0,
          transportUsing: false,
          branchName: 'Branch 12',
        },
        {
          username: 'student',
          name: 'Ahmad Malik',
          fatherName: 'Irshad Malik',
          cnic: '37405-6789012-6',
          permanentAddress: 'Civil Lines, Rawalpindi',
          semester: '6th',
          registrationNumber: 'FA21-BCS-089',
          university: 'COMSATS',
          email: 'ahmad.malik@student.comsats.edu.pk',
          rollNumber: 'FA21-BCS-089',
          hostelName: 'Branch 11',
          roomNumber: 'B11-302',
          mobile: '+92 300 1234567',
          emergencyContact: '+92 312 9876543',
          monthlyFee: 11000.0,
          balanceDue: 11000.0,
          fine: 0.0,
          transportUsing: false,
          branchName: 'Branch 11',
        },
      ];

      for (const s of studentsToSeed) {
        const branch = branches.find((b) => b.name === s.branchName)!;
        const roomKey = `${branch.name}-${s.roomNumber}`;
        const room = dbRooms[roomKey]!;

        const dbStudent = await prisma.student.create({
          data: {
            username: s.username,
            password: 'password',
            name: s.name,
            fatherName: s.fatherName,
            cnic: s.cnic,
            permanentAddress: s.permanentAddress,
            semester: s.semester,
            registrationNumber: s.registrationNumber,
            university: s.university,
            email: s.email,
            rollNumber: s.rollNumber,
            hostelName: s.hostelName,
            roomNumber: s.roomNumber,
            balanceDue: s.balanceDue,
            fine: s.fine,
            transportUsing: s.transportUsing,
            monthlyFee: s.monthlyFee,
            mobile: s.mobile,
            emergencyContact: s.emergencyContact,
            branchId: branch.id,
            roomId: room.id,
          },
        });

        // Increment occupied beds
        await prisma.room.update({
          where: { id: room.id },
          data: {
            occupiedBeds: { increment: 1 },
          },
        });

        // Roommates for Ahmad Malik
        if (s.username === 'student') {
          await prisma.roommate.createMany({
            data: [
              { name: 'Zain Ali', rollNumber: 'FA21-BCS-102', mobile: '+92 301 2223334', email: 'zain.ali@gmail.com', studentId: dbStudent.id },
              { name: 'Hamza Khan', rollNumber: 'FA21-BCS-045', mobile: '+92 302 4445556', email: 'hamza.khan@gmail.com', studentId: dbStudent.id },
              { name: 'Usman Tariq', rollNumber: 'FA21-BCS-118', mobile: '+92 303 6667778', email: 'usman.tariq@gmail.com', studentId: dbStudent.id },
            ],
          });
        }

        // Payments
        if (s.username === 'ahmed') {
          await prisma.payment.create({
            data: { month: 'July 2026', dueDate: '10-07-2026', amount: 25000.0, status: 'Partial Paid', paymentDate: '01-07-2026', transactionId: 'TXN-AHMED-1', method: 'Bank Transfer', studentId: dbStudent.id },
          });
        } else if (s.username === 'ali') {
          await prisma.payment.create({
            data: { month: 'July 2026', dueDate: '10-07-2026', amount: 25000.0, status: 'Paid', paymentDate: '01-07-2026', transactionId: 'TXN-ALI-1', method: 'Easypaisa', verifiedBy: 'admin', studentId: dbStudent.id },
          });
        } else if (s.username === 'hamza') {
          await prisma.payment.create({
            data: { month: 'July 2026', dueDate: '10-07-2026', amount: 25000.0, status: 'Overdue', studentId: dbStudent.id },
          });
        } else if (s.username === 'usman') {
          await prisma.payment.create({
            data: { month: 'July 2026', dueDate: '10-07-2026', amount: 25000.0, status: 'Pending', paymentDate: '02-07-2026', transactionId: 'TXN-USMAN-REF', method: 'JazzCash', studentId: dbStudent.id },
          });
        } else if (s.username === 'bilal') {
          await prisma.payment.create({
            data: { month: 'July 2026', dueDate: '10-07-2026', amount: 25000.0, status: 'Paid', paymentDate: '30-06-2026', transactionId: 'TXN-BILAL-1', method: 'Bank Transfer', verifiedBy: 'admin', studentId: dbStudent.id },
          });
        } else if (s.username === 'student') {
          await prisma.payment.create({
            data: { month: 'July 2026', dueDate: '10-07-2026', amount: 11000.0, status: 'Pending', studentId: dbStudent.id },
          });
          await prisma.payment.create({
            data: { month: 'June 2026', dueDate: '10-06-2026', amount: 11000.0, status: 'Paid', paymentDate: '08-06-2026', transactionId: 'TXN987654321', method: 'Bank Transfer', verifiedBy: 'admin', studentId: dbStudent.id },
          });
        }

        // Complaints
        if (s.username === 'student') {
          await prisma.complaint.create({
            data: {
              title: 'WiFi Not Working',
              category: 'IT Services',
              description: 'The internet connection is extremely slow and disconnects frequently in Room B11-302.',
              status: 'Resolved',
              date: '28-06-2026',
              roomNumber: 'B11-302',
              studentId: dbStudent.id,
            },
          });
          await prisma.complaint.create({
            data: {
              title: 'AC Leakage',
              category: 'Room Issue',
              description: 'Water is leaking from the split AC unit inside Room B11-302.',
              status: 'In Progress',
              date: '01-07-2026',
              roomNumber: 'B11-302',
              studentId: dbStudent.id,
            },
          });
        } else if (s.username === 'hamza') {
          await prisma.complaint.create({
            data: {
              title: 'Geyser Repair Required',
              category: 'Room Issue',
              description: 'The hot water is not working in the bathroom of Room B2-301.',
              status: 'Open',
              date: '02-07-2026',
              roomNumber: 'B2-301',
              priority: 'Urgent',
              studentId: dbStudent.id,
            },
          });
        }

        // Welcome Notification
        await prisma.notification.create({
          data: {
            title: 'Welcome to Royal Portal',
            content: 'Hi, welcome to the student housing database ecosystem. Monitor your room, fees and bills here.',
            type: 'Info',
            date: '01-07-2026',
            studentId: dbStudent.id,
          },
        });
      }
      console.log('Created students and their sub-resources.');

      // 6. Create Transport Routes
      await prisma.transportRoute.create({
        data: {
          routeNumber: 'R-1',
          destination: 'COMSATS Campus',
          departure: '07:30 AM / 08:30 AM',
          status: 'Active',
          driverName: 'Mohammad Irfan',
          contact: '+92 345 5551234',
        },
      });

      await prisma.transportRoute.create({
        data: {
          routeNumber: 'R-2',
          destination: 'IQRA Campus',
          departure: '01:30 PM / 02:30 PM',
          status: 'Active',
          driverName: 'Sajid Mahmood',
          contact: '+92 345 5554321',
        },
      });
      console.log('Created transport routes.');
      console.log('Auto-seed completed successfully!');
    } catch (e) {
      console.error('Failed to auto-seed database:', e);
    } finally {
      seedingPromise = null;
    }
  })();

  return seedingPromise;
}

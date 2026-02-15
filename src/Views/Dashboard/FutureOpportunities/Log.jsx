import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    IconButton,
    Pagination,
    styled,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CustomTable from '../../../components/CustomTable/CustomTable';

const data = [
    {
        date: '06/23/2025',
        category: 'Spicy',
        remindBy: 'Lazy Sunday Snuggle Session',
        description: 'Redeem for a full day of cuddling, movies, and absolutely no chores or errands—just you, me, and snacks.',
        pocs: 'Pending',
        misc: 'Pending',
    },
    { date: '06/24/2025', category: 'Mild', remindBy: 'Book a Dinner Date', description: 'Fancy Italian or cozy home-cooked? Your choice.', pocs: 'Completed', misc: 'Reminder: 5pm' },
    { date: '06/25/2025', category: 'Fun', remindBy: 'Go to the Beach', description: 'Sunscreen, sand, and maybe an ice cream cone.', pocs: 'Pending', misc: 'Weather check' },
    { date: '06/26/2025', category: 'Adventure', remindBy: 'Try a New Recipe', description: 'Something challenging and delicious. Cleanup crew is you!', pocs: 'Completed', misc: 'Ingredients bought' },
    { date: '06/27/2025', category: 'Relax', remindBy: 'Silent Reading Hour', description: 'One full hour, no screens, just books and a blanket.', pocs: 'Pending', misc: 'Grab your favorite book' },
    { date: '06/30/2025', category: 'Important', remindBy: 'Update Passports', description: 'Renewing our passports for future trips!', pocs: 'Completed', misc: 'Scheduled appt' },
    { date: '07/01/2025', category: 'Work', remindBy: 'Finish Project Report', description: 'Due by end of the week, need to wrap up all sections.', pocs: 'Pending', misc: 'Draft ready' },
    { date: '07/02/2025', category: 'Health', remindBy: 'Annual Check-up', description: 'Time for our yearly health screenings and vaccinations.', pocs: 'Completed', misc: 'Appointment at 10am' },
    { date: '07/03/2025', category: 'Finance', remindBy: 'Review Budget', description: 'Look over last month\'s expenses and adjust for next month.', pocs: 'Pending', misc: 'Spreadsheet updated' },
    { date: '07/04/2025', category: 'Family', remindBy: 'Call Parents', description: 'Catch up and see how they\'re doing.', pocs: 'Completed', misc: 'Set reminder' },
    { date: '07/05/2025', category: 'Social', remindBy: 'Plan Weekend Getaway', description: 'Find a nice spot for a short trip with friends.', pocs: 'Pending', misc: 'Check availability' },
    { date: '07/06/2025', category: 'Learning', remindBy: 'Start Online Course', description: 'Enroll in that photography class I\'ve been eyeing.', pocs: 'Completed', misc: 'Course started' },
    { date: '07/07/2025', category: 'Hobby', remindBy: 'Gardening Day', description: 'Plant new flowers and vegetables in the garden.', pocs: 'Pending', misc: 'Buy seeds' },
    { date: '07/08/2025', category: 'Travel', remindBy: 'Book Flights', description: 'Plan our next vacation and book the tickets.', pocs: 'Completed', misc: 'Itinerary ready' },
    { date: '07/09/2025', category: 'Maintenance', remindBy: 'Car Service', description: 'Regular maintenance check and oil change.', pocs: 'Pending', misc: 'Appointment at 3pm' },
];

const columns = [
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "remindBy", label: "Remind By" },
  { key: "description", label: "Description" },
  { key: "pocs", label: "POCS", align: "center" },
  { key: "misc", label: "Misc", align: "right" },
];


const Log = () => {


    return (
        <Box sx={{ minHeight: '100vh' }}>
            <CustomTable columns={columns} data={data} rowsPerPage={5} />
        </Box>
    );
};

export default Log;
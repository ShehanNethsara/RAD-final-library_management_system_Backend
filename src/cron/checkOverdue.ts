import cron from 'node-cron';
import Borrow from '../model/Borrow';
import sendEmail from '../util/sendEmail';

const checkOverdueBooks = () => {
  // හැමදාම උදේ 9:00 ට මේක Run වෙනවා ('0 9 * * *')
  cron.schedule('0 9 * * *', async () => {
    console.log('Running Overdue Check...');

    try {
      const currentDate = new Date();

      // Return නොකරපු (Borrowed) සහ දින පහු වුන (dueDate < now) පොත් හොයනවා
      const overdueBorrows = await Borrow.find({
        status: 'Borrowed',
        dueDate: { $lt: currentDate }
      }).populate('user', 'email name') // User ගේ Email එක ඕන නිසා
        .populate('book', 'title');     // පොතේ නම ඕන නිසා

      if (overdueBorrows.length === 0) {
        console.log('No overdue books found.');
        return;
      }

      // හැම overdue පොතකටම Email එකක් යවනවා
      for (const borrow of overdueBorrows) {
        const user: any = borrow.user;
        const book: any = borrow.book;

        if (user && user.email) {
            const message = `Hello ${user.name},\n\nThe book "${book.title}" you borrowed is overdue. The due date was ${new Date(borrow.dueDate).toDateString()}.\n\nPlease return it as soon as possible to avoid fines.\n\nThank you,\nLibFlow Library`;
            
            await sendEmail(user.email, "Overdue Book Alert! 📕", message);
        }
      }

    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};

export default checkOverdueBooks;
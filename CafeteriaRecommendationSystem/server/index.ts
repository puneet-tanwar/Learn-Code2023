import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { UserService } from './services/userService';
import { AdminService } from './services/adminServices';
import { User, UserRole } from './types/user';

interface CallbackResponse {
  status: 'success' | 'error';
  result?: any;
  error?: any;
}

interface CustomSocket extends Socket {
  role?: UserRole;
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const userService = new UserService();
const adminService = new AdminService();
const userSessions = new Map<string, User>();

io.on('connection', (socket: CustomSocket) => {
  console.log('A user connected');

  socket.on('signup', async (user: User, callback: (response: CallbackResponse) => void) => {
    try {
      console.debug({ dataComingFromUser: user });
      const result = await userService.createUser(user);
      result.userRole = user.role;
      userSessions.set(socket.id, user);
      callback({ status: 'success' });
    } catch (error) {
      callback({ status: 'error', error });
    }
  });
  socket.on('login', async (loginData: { email: string, password: string }, callback: (response: CallbackResponse) => void) => {
    try {
      const user = await userService.getUserByEmail(loginData.email);
      if (user && user.password === loginData.password) {
        socket.data.currentUser = user;
        userSessions.set(socket.id, user);
        console.warn({userSessions})
        callback({ status: 'success', result: user });
      } else {
        callback({ status: 'error', error: 'Invalid email or password' });
      }
    } catch (error) {
      callback({ status: 'error', error });
    }
  });
  
  socket.on('viewMenu', async (callback: (response: CallbackResponse) => void) => {
    console.log('Client requested menu data');

    try {
      
      const menuItems = await userService.getMenuItems();

      
      callback({ status: 'success', result: menuItems });
    } catch (error) {
      console.error('Error fetching menu items:');
      
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000');
});

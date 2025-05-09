const express = require('express');
const cors = require('cors');
const UserRouter = require('./routers/userRouter');
const AdminRouter = require('./routers/adminRouter');
const EmployeeRouter = require('./routers/employeeRouter');
const ManagerRouter = require('./routers/managerRouter');
const AddemployeeRouter = require('./routers/addemployeeRouter');
const TaskRouter = require('./routers/taskRouter');
const authRouter = require('./routers/authRouter');
const sessionRouter = require('./routers/sessionRouter');
const recordingRouter = require('./routers/recordingRouter');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}))

app.use(express.json());

app.use('/user', UserRouter);
app.use('/task', TaskRouter);
app.use('/admin', AdminRouter);
app.use('/employee', EmployeeRouter);
app.use('/manager', ManagerRouter);
app.use('/webauthn', authRouter);
app.use('/session', sessionRouter);
app.use('/recording', recordingRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//app.use('/addemployee', AddemployeeRouter);
app.get('/', (req, res) => {
    console.log('response from express');
})

app.listen(port, () => {
    console.log('server started');
})
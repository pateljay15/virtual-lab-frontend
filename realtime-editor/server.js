const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const compiler = require('compilex')
const http = require("http")
const path = require("path")
const { Server } =  require("socket.io")
const { Socket } = require("socket.io-client")
const ACTIONS = require("./src/Actions")
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const server = http.createServer(app)
const io = new Server(server)

app.use(
   cors({
      allowedHeaders: ['sessionId', 'Content-Type'],
      exposedHeaders: ['sessionId'],
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
   })
);

var option = { stats: true };
compiler.init(option);

// Compilex & Hackerearth-node
// For C language
app.post('/compile/c', function (req, res) {
   console.log('entered here');
   var code = req.body.code;
   var input = req.body.input;
   // console.log(code);
   // console.log(input);
   // compiler.flush(function() {
   // 	console.log('All previous temporary files flushed !');
   // });
   if (input === '') {
      var envData = { OS: 'windows' };
      compiler.compilePython(JSON.stringify(envData), JSON.stringify(code), (data) => {
         console.log(data)
      })
      // compiler.compileCPP(envData, code, (res) => {
      //    console.log(res)
      // })
   //    compiler.compileCPP(envData, code, (data) => {
   //       console.log(data)
   //       if (data.error) {
   //          res.send({
   //             output: data.error,
   //             status: false,
   //          });
   //       } else {
   //          output = data.output;
   //          res.send({
   //             output: output,
   //             status: true,
   //          });
   //       }
   //    });
   // } else {
   //    var envData = { OS: 'linux', cmd: 'gcc', options: { timeout: 1000 } };
   //    compiler.compileCPPWithInput(envData, code, input, function (data) {
   //       if (data.error) {
   //          res.send({
   //             output: data.error,
   //             status: false,
   //          });
   //       } else {
   //          console.log(data.output);
   //          res.send({
   //             output: data.output,
   //             status: true,
   //          });
   //       }
   //    });
   }
});



// app.use(express.static('build'))

// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "build", "index.html"))
// })




const userSocketMap = {}
// {
//     // socket id   //username
//     "bvdibsbuiu": "jay Patel"
// }
const userSocketCode = {}

const socket_rooms = [];

function getAllConnectedClients (roomId) {
    // below return thing is map , so we have typecast in Array
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
            code: userSocketCode[socketId],
        }
    })
}

io.on('connection', (socket) => {
    console.log("socket connected", socket.id)

    socket.on('get-rooms', (data) => {
        socket.emit('send-rooms', {
            rooms: socket_rooms,
        });
     });

     socket.on('create-room', (data) => {
        let room = {
           socketID: socket.id,
           roomId: data.roomId,
           question: '',
           username: data.username,
           students: [],
        };
        socket.join(data.roomId);
        // socket_rooms.push(room);
        if (socket_rooms.length > 0) {
           socket_rooms.forEach((roo) => {
              if (roo.roomId === data.roomId) {
                 // ROOM IS ALREADY CREATED
              } else {
                 socket_rooms.push(room);
              }
           });
        } else {
           socket_rooms.push(room);
        }
        // console.log('____________________________________');
        // console.log('create-room')
        // console.log('____________________________________');
        // console.log('JOINED')
        // console.log('____________________________________')
        // console.log('Socket_room')
        // console.log(socket_rooms);
     });

    
     socket.on('join-room', (data) => {
        // console.log('join-room')
        socket.join(data.roomId);
        let student = {
           socketID: socket.id,
           username: data.username,
        };
        console.log(student);
        socket_rooms.forEach((room) => {
           if (room.roomId == data.roomId) {
              room.students.push(student);
           }
        });
        let question;
        socket_rooms.forEach((room) => {
           if (room.roomId == data.roomId) {
              question = room.question;
           }
        });

        let teacher_socketID
        let students = [];
        socket_rooms.forEach((room) => {
           if (room.roomId === data.roomId) {
              students = room.students;
              teacher_socketID = room.socketID
           }
        });

        socket.broadcast.to(teacher_socketID).emit('send-students-to-teacher', {
            students: students
         });
        // console.log('send-student')
        // console.log(students)
        socket.broadcast.to(socket.id).emit('send-student', {
           students: [student]
        });
        // console.log('____________________________________');
        // console.log('JOINED')
        // console.log('____________________________________')
        // console.log('Socket_room')
        // console.log(socket_rooms);
        // console.log('ROom')
        // console.log(rooms);
        socket.emit('get-question', { question: question });
        // 		Left more to be coded
     });

    
     socket.on('get-students', (data) => {
        let students = [];
        socket_rooms.forEach((room) => {
           if (room.roomId === data.roomId) {
              students = room.students;
           }
        });
        // console.log('send-student')
        // console.log(students)
        socket.emit('send-student', {
           students: students,
        });
     });

    
     socket.on('get-code-from-student', (data) => {
        let student_socketID;
        socket_rooms.forEach((room) => {
           if (room.roomId == data.roomId) {
              room.students.forEach((student) => {
                 if (student.username === data.username) {
                    student_socketID = student.socketID;
                    // console.log('Data is being requesting from student');
                    // console.log(student.username);
                 }
              });
           }
        });
        // console.log("getting code.........", )
        socket.to(data.roomId).emit('isActive');
        socket.broadcast.to(student_socketID).emit('teacher-requesting-code');
     });
    

     socket.on('acknowledge-with-code', (data) => {
        let teacher_socketID;
        socket_rooms.forEach((room) => {
           if (room.roomId == data.roomId) {
              teacher_socketID = room.socketID;
              // console.log('Data is being send to treacher')
              // console.log(room.username);
           }
        });
        // console.log("Code", data.code);
        socket.broadcast.to(teacher_socketID).emit('teacher-requesting-code', {
           code: data.code,
        });
     });

     socket.on('transfer-teacher-data', (data) => {
        let student_socketID;
        socket_rooms.forEach((room) => {
           if (room.roomId == data.roomId) {
              room.students.forEach((student) => {
                 if (student.username === data.username) {
                    student_socketID = student.socketID;
                 }
              });
           }
        });
        console.log("username", data.username)
        console.log("code", data.code, student_socketID)
        socket.broadcast.to(student_socketID).emit('teacher-changes', {
           code: data.code,
         //   cursorPosition: data.cursorPosition,
        });
     });
    
     socket.on('focus-lost', (data) => {
      // console.log('focus-lost')
      let teacher_socketID;
      let student_index;

      socket_rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            room.students.forEach((student, index) => {
               if (student.username === data.username) {
                  student_index = index;
               }
            });
            room.students[student_index].isActive = false;
         }
      });

      socket_rooms.forEach((room, index) => {
         if (room.roomId == data.roomId) {
            teacher_socketID = room.socketID;
            teacher_index = index;
         }
      });
      socket.broadcast.to(teacher_socketID).emit('teacher-focus-lost', {
         student_username: data.username,
      });
   });

   socket.on('focus-gain', (data) => {
      let teacher_socketID;
      let student_index;
      socket_rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            room.students.forEach((student, index) => {
               if (student.username === data.username) {
                  student_index = index;
               }
            });
            room.students[student_index].isActive = true;
         }
      });

      socket_rooms.forEach((room) => {
         if (room.roomId == data.roomId) {
            teacher_socketID = room.socketID;
         }
      });
      socket.broadcast.to(teacher_socketID).emit('teacher-focus-gain', {
         student_username: data.username,
      });
   });


   socket.on('disconnect-user', (data) => {
      let teacher_socketID;
      if (data.designation == 'Student') {
         socket_rooms.forEach((room) => {
            if (room.roomId == data.roomId) {
               teacher_socketID = room.socketID;
            }
         });
         socket.broadcast
            .to(teacher_socketID)
            .emit('remove-the-editor', { username: data.username });
         // console.log('Student disconnected')
         socket.disconnect();

         let removal_index;
         socket_rooms.forEach((room) => {
            if (room.roomId == data.roomId) {
               room.students.forEach((student, index) => {
                  if (student.username === data.username) {
                     removal_index = index;
                     // console.log('Student removed from socket_rooms');
                  }
               });
               room.students.splice(removal_index, 1);
            }
         });
         // let i;
         // rooms.forEach((room) => {
         //    if (room.roomId === data.roomId) {
         //       room.students.forEach((student, index) => {
         //          if (student.username === data.username) {
         //             i = index;
         //             // console.log('Student removed from Rooms');
         //          }
         //       });
         //       room.students.splice(i, 1);
         //    }
         // });
         // socket.emit('remove-the editor');
      } else {
         socket.to(data.roomId).emit('disconnect-all-user');
         // socket_rooms.forEach((roomId) => {
         //                socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
         //                    socketId: socket.id,
         //                    username: userSocketMap[socket.id]
         //                })  
         //            })
         socket.disconnect();
         // console.log('Teacher disconnected')
         let room_index;
         // rooms.forEach((room, index) => {
         //    if (room.roomId == data.roomId) {
         //       room_index = index;
         //       // console.log('Room removed from Rooms')
         //    }
         // });
         // rooms.splice(room_index, 1);
         socket_rooms.forEach((room, index) => {
            if (room.roomId == data.roomId) {
               room_index = index;
               room.students.forEach(student => {
                  socket.broadcast
                  .to(student.socketID)
                  .emit('disconnect-all');
               })
               // console.log('Room removed from Socket ROoms')
            }
         });
         socket_rooms.splice(room_index, 1);
      }
   });
    // socket.on(ACTIONS.JOIN, ({ roomId, username, code }) => {
    //     userSocketMap[socket.id] = username
    //     userSocketCode[socket.id] = code
    //     socket.join(roomId)
    //     const clients = getAllConnectedClients(roomId)
    //     console.log(clients)
    //     clients.forEach(({ socketId }) => {
    //         io.to(socketId).emit(ACTIONS.JOINED, {
    //             clients,
    //             username,
    //             socketId: socket.id
    //         })
    //     })
    // })

    // socket.on(ACTIONS.CODE_CHANGE , ({ roomId, code}) => {
    //     socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code })
    // })

    // socket.on(ACTIONS.SYNC_CODE, ({ socketId, code}) => {
    //     io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code })
    // })

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })  
        })
        delete userSocketMap[socket.id]
        socket.leave()
    })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))




// const express = require("express")
// const app = express()
// const http = require("http")
// const path = require("path")
// const { Server } =  require("socket.io")
// const { Socket } = require("socket.io-client")
// const ACTIONS = require("./src/Actions")

// const server = http.createServer(app)
// const io = new Server(server)

// app.use(express.static('build'))

// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "build", "index.html"))
// })

// const userSocketMap = {}
// // {
// //     // socket id   //username
// //     "bvdibsbuiu": "jay Patel"
// // }

// function getAllConnectedClients (roomId) {
//     // below return thing is map , so we have typecast in Array
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
//         return {
//             socketId,
//             username: userSocketMap[socketId],
//         }
//     })
// }

// io.on('connection', (socket) => {
//     console.log("socket connected", socket.id)

//     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//         userSocketMap[socket.id] = username
//         socket.join(roomId)
//         const clients = getAllConnectedClients(roomId)
//         console.log(clients)
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit(ACTIONS.JOINED, {
//                 clients,
//                 username,
//                 socketId: socket.id
//             })
//         })
//     })

//     socket.on(ACTIONS.CODE_CHANGE , ({ roomId, code}) => {
//         socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code })
//     })

//     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code}) => {
//         io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code })
//     })

//     socket.on('disconnecting', () => {
//         const rooms = [...socket.rooms]
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id]
//             })  
//         })
//         delete userSocketMap[socket.id]
//         socket.leave()
//     })
// })

// const PORT = process.env.PORT || 5000
// server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))

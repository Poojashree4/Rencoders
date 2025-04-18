const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bodyParser = require('body-parser');
const Joi = require("joi");
require('dotenv').config();
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());


const uri = "mongodb://localhost:27017/Rencoders";
const JWT_SECRETS = process.env.JWT_SECRET ;


const dbName = "Rencoders";

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

const headerSchema = Joi.object({
  authorization: Joi.string()
  .pattern(/^Bearer\s[\W-]+\.[\W-]+\.[\W-]$/)
  .required()
  .messages({
    'string.pattern.base': 'Authorization header must be a valid Bearer token'
  })

}).unknown(true); 

const authenticateTokens = (req, res, next) => {
  const { error: bodyError } = tokenSchema.validate(req.body);

  console.log(req.body,"error",bodyError)
  if (bodyError) {
    return res.status(401).json({ error: bodyError.details[0].message });
  }

  const { token } = req.body;

  jwt.verify(token, JWT_SECRETS, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    req.user = decoded;
    delete req.body.token;
    next();
  });
};

const tokenSchema = Joi.object({
  token: Joi.string()
    .pattern(/^[\w-]+\.[\w-]+\.[\w-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Token must be a valid JWT format'
    })
})

module.exports = authenticateTokens;

// Authentication middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; 

//   if (!token) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   jwt.verify(token, JWT_SECRETS, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ error: "Invalid or expired token" });
//     }
//     req.user = decoded;
//     next();
//   });
// };

async function connect() {
  const client = new MongoClient(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
  await client.connect();

 
  return client;
}

// const createToken = (userId) => {
//   return jwt.sign({ userId }, JWT_SECRETS, { expiresIn: "1h" });
// };

// Temporary in-memory store 
let userPreferences = [];

// // POST route to save notification preferences
// app.post('/save-notifications', (req, res) => {
//   const {
//     emailNotifications,
//     smsNotifications,
//     appUpdates,
//     promotionalOffers,
//     eventReminders,
//     pushToken,
//   } = req.body;

//   if (!pushToken) {
//     return res.status(400).json({ error: 'Push token is required' });
//   }

//   const preferences = {
//     emailNotifications,
//     smsNotifications,
//     appUpdates,
//     promotionalOffers,
//     eventReminders,
//     pushToken,
//     updatedAt: new Date(),
//   };

//   // For demo: overwrite or add to the array
//   const index = userPreferences.findIndex(p => p.pushToken === pushToken);
//   if (index > -1) {
//     userPreferences[index] = preferences;
//   } else {
//     userPreferences.push(preferences);
//   }

//   console.log('User preferences saved:', preferences);
//   return res.status(200).json({ message: 'Preferences saved successfully' });
// });




// Login with OTP flow

const otpStore = new Map(); // key: email, value: { otp, expires }

app.post('/login', async (req, res) => {
  let client;
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    client = await connect();
    const db = client.db();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate OTP (6-digit numeric)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to memory for verification (valid for 5 mins)
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    // Send OTP to user's email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code for Rencoders Login",
      text: `Your OTP is: ${otp}`
    });

    return res.status(200).json({ message: "OTP sent to email" });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server Error", details: error.message });
  } finally {
    if (client) await client.close();
  }
});


// Verify OTP endpoint
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore.get(email);
  if (!record) {
    return res.status(400).json({ error: "OTP not found or expired" });
  }

  const { otp: storedOtp, expires } = record;

  if (Date.now() > expires) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP expired" });
  }

  if (otp !== storedOtp) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  // Clear used OTP
  otpStore.delete(email);

  // Fetch user info again 
  const client = await connect();
  const user = await client.db().collection('users').findOne({ email });
  await client.close();

 // const token = createToken(user._id);
const token = jwt.sign({email:user.email,role:user.role},JWT_SECRETS,{expiresIn:"48h"});
  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      roleId:user.roleId,
    }
  });
});




app.post('/register', async (req, res) => {
  try {
    const client = await connect();
    const userCol = client.db("Rencoders").collection("users");
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      email: email,
      password: hashedPassword,
      isActive: false
    };
    await userCol.insertOne(newUser);

    const token = createToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      token 
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server Error" });
  }
  finally{
    await client.close();
  }
});



const profileSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    
  })
});
// const profileSchema = Joi.object({
//   token: Joi.string().required(),
//   email: Joi.string().email()  // <-- add this line
// });

const profileUpdateSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    
  }),
  name: Joi.string().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters"
  }),
  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .messages({
      "string.pattern.base": "Phone number must be a valid 10-digit number"
    }),
  experience: Joi.number().min(0).max(50).messages({
    "number.min": "Experience cannot be negative",
    "number.max": "Experience cannot exceed 50 years"
  }),
  location: Joi.string().min(2).max(100).messages({
    "string.min": "Location must be at least 2 characters long",
    "string.max": "Location cannot exceed 100 characters"
  })
}).or("name", "phoneNumber", "experience", "location").messages({
  "object.missing": "At least one field (name, phoneNumber, experience, location) must be provided to update"
});

// Profile Endpoint
app.post('/profile', async (req, res) => {
  try {
    const { error,value } = profileSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ error: error.details.map((err) => err.message) });
    }

     client = await connect();
    const userCol = client.db("Rencoders").collection("users");
    const { email } = value;

    const user = await userCol.findOne({ email }, { projection: { password: 0 } }); 

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      role:user.role,
      roleId:user.roleId,
      phoneNumber: user.phoneNumber,  
      experience: user.experience,   
      location: user.location        
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Server Error" });
  }
  finally{
  
      await client.close();
    
  }
});

// app.post('/profile', authenticateTokens, async (req, res) => {
//   try {
//     const { error,value } = profileSchema.validate(req.body, { abortEarly: false });

//         if (error) {
//           return res.status(400).json({ error: error.details.map((err) => err.message) });
//         }
//     const { token } = req.body;
//     const decoded = jwt.verify(token, JWT_SECRETS); // Already validated by middleware
//     const email = decoded.email;

//     client = await connect();
//     const userCol = client.db("Rencoders").collection("users");

//     const user = await userCol.findOne({ email }, { projection: { password: 0 } });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       roleId: user.roleId,
//       phoneNumber: user.phoneNumber,
//       experience: user.experience,
//       location: user.location
//     });

//   } catch (error) {
//     console.error("Profile error:", error);
//     res.status(500).json({ error: "Server Error" });
//   } finally {
//     await client.close();
//   }
// });


// Profile Update Endpoint
app.post('/profileupdate', async (req, res) => { 
  try {
    const { error,value } = profileUpdateSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ error: error.details.map((err) => err.message) });
    }

     client = await connect();
    const userCol = client.db("Rencoders").collection("users");
    const email = req.user.email;
    const { name, phoneNumber, experience, location } = value;

    const updates = {};
    if (name) updates.name = name;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (experience) updates.experience = experience;
    if (location) updates.location = location;

    const result = await userCol.updateOne({ email }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server Error" });
  }
  finally{
   
      await client.close();
    
  }
});

const addStudentSchema = Joi.object({
  studentname: Joi.string().min(2).max(50).required(),
  learningMode: Joi.string().valid("online", "offline").required(),
  courses: Joi.array()
    .items(
      Joi.object({
        courseName: Joi.string().min(2).max(100).required(),
        courseID: Joi.string().required(),
        duration: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required()
});

// Display Student Schema
const displayStudentSchema = Joi.object({
  learningMode: Joi.string().valid("online", "offline").messages({
    "any.only": "Learning mode must be either 'online' or 'offline'"
  })
});


const updateStudentSchema = Joi.object({
  studentId: Joi.number().required().messages({
    
    "number.base": "Student ID must be a number"
  }),
  studentname: Joi.string().min(3).max(50).required().messages({
    "string.min": "Student name must be at least 3 characters long",
    "string.max": "Student name cannot exceed 50 characters",
    
  }),
  learningMode: Joi.string().valid("online", "offline").required().messages({
    "any.only": "Learning mode must be either 'online' or 'offline'",

  }),
  totalDuration: Joi.number().min(1).required().messages({
    "number.min": "Total duration must be at least 1",
    
    "number.base": "Total duration must be a number"
  }),
  courses: Joi.array()
    .items(
      Joi.object({
        courseName: Joi.string().min(3).max(100).required().messages({
          "string.min": "Course name must be at least 3 characters long",
          "string.max": "Course name cannot exceed 100 characters",
         
        }),
        courseID: Joi.string().required().messages({
          "any.required": "Course ID is required"
        }),
        duration: Joi.number().min(1).required().messages({
          "number.min": "Duration must be at least 1",
         
          "number.base": "Duration must be a number"
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one course is required",
      
    }),
});


const authenticateJWT = async (req, res, next) => {
  try {
    // Validate headers first
    const { error: headerError } = headerSchema.validate(req.headers);
    if (headerError) {
      return res.status(401).json({ error: headerError.details[0].message });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRETS);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
   
    
    console.error("Authentication error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
};

app.post("/displaystudent", authenticateTokens, async (req, res) => {
  let client;
  try {
  

    const { error } = displayStudentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    client = await connect();
    const studentCol = client.db("Rencoders").collection("studentdetails");

    const students = await studentCol.find({}).toArray();

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Server Error" });
  } finally {
    if (client) await client.close();
  }
});


// // Add this to your backend routes
// app.post("/addstudent", authenticateTokens, async (req, res) => {
//  let client;
//   try {
//     const { error } = addStudentSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }
//     const { studentId } = req.body;
//     console.log("Received token:", token);
//     console.log("Decoded (non-verified):", jwt.decode(token));
    
//     if (!studentId) {
//       return res.status(400).json({ error: "Student ID is required" });
//     }

//     client = await connect();
//     const studentCol = client.db("Rencoders").collection("studentdetails");

//     const student = await studentCol.findOne({ 
//       studentId: Number(studentId) 
//     });

//     if (!student) {
//       return res.status(404).json({ error: "Student not found" });
//     }

//     // Return minimal sensitive data
//     const responseData = {
//       studentId: student.studentId,
//       studentname: student.studentname,
//       learningMode: student.learningMode,
//       courses: student.courses,
//       totalDuration: student.totalDuration
//     };

//     res.status(200).json(responseData);
//   } catch (err) {
//     console.error("Error fetching student details:", err);
//     res.status(500).json({ error: "Internal server error" });
//   } finally {
//     if (client) await client.close();
//   }
// });

app.post("/addstudent", async (req, res) => {
  try {
    const client = await connect();
    const studentCol = client.db("Rencoders").collection("studentdetails");

    const { studentname, learningMode, courses } = req.body;
//     const data = await response.json();
// console.log('Fetched student data:', data); // 🔍 log here
// setStudents(Array.isArray(data) ? data : []);


    if (!studentname || !learningMode || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ error: "Student name, learning mode, and at least one course are required" });
    }

    // Validate that each course has a courseName, courseID, and duration
    for (let course of courses) {
      if (!course.courseName || !course.courseID || !course.duration) {
        return res.status(400).json({ error: "Each course must have a courseName, courseID, and duration" });
      }
    }

    const existingStudent = await studentCol.findOne({ studentname });

    if (existingStudent) {
      return res.status(400).json({ error: "Student with this name already exists" });
    }

    // Calculate total duration
    const totalDuration = courses.reduce((sum, course) => sum + Number(course.duration), 0);

    // Generate a unique studentId 
    const studentId = new Date().getTime() % 100; 

    
    const result = await studentCol.insertOne({
      studentId,
      studentname,
      learningMode,
      totalDuration,
      courses: courses.map((course) => ({
        courseName: course.courseName,
        courseID: course.courseID,
        duration: Number(course.duration),
      })),
    });

    // Check if insertion was successful
    if (result.insertedId) {
      return res.status(201).json({
        message: "Student added successfully",
        student: {
          studentId,
          studentname,
          learningMode,
          totalDuration,
          courses,
        },
      });
    } else {
      return res.status(500).json({ error: "Failed to add student" });
    }
  } catch (error) {
    console.error("Error while adding student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  finally {
    if (client) await client.close();
  }
});

// // Updated Update Student Endpoint
// app.post("/updatestudent", authenticateJWT, async (req, res) => {
//   let client;
//   try {
//     // Validate request body
//     const { value: validatedBody, error } = updateStudentSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//       return res.status(400).json({ error: error.details.map(e => e.message) });
//     }

//     client = await connect();
//     const studentCol = client.db("Rencoders").collection("studentdetails");
//     const { studentId, studentname, learningMode, courses } = validatedBody;

//     // Calculate total duration
//     const totalDuration = courses.reduce((sum, course) => sum + Number(course.duration), 0);

//     // Update student
//     const result = await studentCol.updateOne(
//       { studentId: Number(studentId) },
//       { $set: {
//           studentname,
//           learningMode,
//           totalDuration,
//           courses: courses.map(course => ({
//             courseName: course.courseName,
//             courseID: course.courseID,
//             duration: course.duration
//           })),
//           updatedAt: new Date(),
//           updatedBy: req.user.userId
//         }
//       }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ error: "Student not found" });
//     }

//     res.status(200).json({ 
//       message: "Student updated successfully",
//       totalDuration
//     });
//   } catch (err) {
//     console.error("Error updating student:", err);
//     res.status(500).json({ error: "Internal server error" });
//   } finally {
//     if (client) await client.close();
//   }
// });

app.post("/updatestudent", async (req, res) => {
  try {
    const client = await connect();
    const studentCol = client.db("Rencoders").collection("studentdetails");

    const { studentId, studentname, courses, learningMode, totalDuration } = req.body;

    if (!studentId || !studentname || !learningMode || !totalDuration || !courses || !Array.isArray(courses)) {
      return res.status(400).json({ error: "All fields (studentId, studentname, courses, learningMode, totalDuration) are required" });
    }

   
    for (let course of courses) {
      if (!course.courseName || !course.courseID || typeof course.duration !== 'number') {
        return res.status(400).json({ error: "Each course must have courseName, courseID, and duration" });
      }
    }

    // Check if the student exists
    const existingStudent = await studentCol.findOne({ studentId });
    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Prepare the updated student document
    const updatedStudent = {
      studentname,
      learningMode,
      totalDuration,
      courses: courses.map(course => ({
        courseName: course.courseName,
        courseID: course.courseID,
        duration: course.duration,
      })),
    };

    // Update the student record
    const result = await studentCol.updateOne({ studentId }, { $set: updatedStudent });

    if (result.modifiedCount > 0) {
      return res.status(200).json({
        message: "Student updated successfully",
        student: updatedStudent
      });
    } else {
      return res.status(500).json({ error: "Failed to update student" });
    }
  } catch (error) {
    console.error("Error while updating student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) await client.close();
  }
});




// staff schema
// const addStaffSchema = Joi.object({
//   staffId: Joi.number().required().messages({
//     "any.required": "Staff ID is required",
//     "number.base": "Staff ID must be a number"
//   }),
//   staffName: Joi.string().min(2).max(50).required().messages({
//     "string.min": "Staff name must be at least 2 characters long",
//     "string.max": "Staff name cannot exceed 50 characters",
//     "any.required": "Staff name is required"
//   }),
//   specificCourse: Joi.array()
//     .items(Joi.string().min(2).max(100).required())
//     .min(1)
//     .required()
//     .messages({
//       "array.min": "At least one course is required",
//       "any.required": "Specific courses are required",
//       "string.min": "Course name must be at least 2 characters long",
//       "string.max": "Course name cannot exceed 100 characters"
//     })
// });

const displayStaffSchema = Joi.object({
  staffId: Joi.number().messages({
    "number.base": "Staff ID must be a number"
  }),
  staffName: Joi.string().min(2).max(50).messages({
    "string.min": "Staff name must be at least 2 characters long",
    "string.max": "Staff name cannot exceed 50 characters"
  })
});

// const updateStaffSchema = Joi.object({
//   staffId: Joi.string().required().messages({
   
//     "number.base": "Staff ID must be a number"
//   }),
//   staffName: Joi.string().min(2).max(50).required().messages({
//     "string.min": "Staff name must be at least 2 characters long",
//     "string.max": "Staff name cannot exceed 50 characters",
//     "any.required": "Staff name is required"
//   }),
//   specificCourse: Joi.array()
//     .items(Joi.string().min(2).max(100))
//     .min(1)
//     .required()
//     .messages({
//       "array.min": "At least one course is required",
//       "any.required": "Specific courses are required",
//     }),
// });


app.post("/addstaff", async (req, res) => {
  try {
    const client = await connect();
    const staffCol = client.db("Rencoders").collection("staffdetails");
    const { staffId, staffName, specificCourse } = req.body;

    
    if (!staffId || !staffName || !specificCourse) {
      return res.status(400).json({ error: "All fields (staffId, staffName, specificCourse) are required" });
    }

    if (!Array.isArray(specificCourse)) {
      return res.status(400).json({ error: "specificCourse must be an array" });
    }

    const existingStaff = await staffCol.findOne({ staffId });

    if (existingStaff) {
      return res.status(400).json({ error: "Staff member already exists" });
    }

    const result = await staffCol.insertOne({
      staffId,
      staffName,
      specificCourse
    });

    if (result.insertedId) {
      return res.status(201).json({ 
        message: "Staff added successfully", 
        staff: { 
          staffId, 
          staffName, 
          specificCourse
        } 
      });
    } else {
      return res.status(500).json({ error: "Failed to add staff" });
    }
  } catch (error) {
    console.log("Error while adding staff:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/displaystaff", async (req, res) => {
  try {
    const { error } = displayStaffSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

     client = await connect();
    const staffCol = client.db("Rencoders").collection("staffdetails");

    let query = {};
    if (req.body.staffId) {
      query.staffId = req.body.staffId;
    }
    if (req.body.staffName) {
      query.staffName = req.body.staffName;
    }

    const staff = await staffCol.find(query).toArray();

    if (staff.length === 0) {
      return res.status(404).json({ message: "No staff members found" });
    }

    res.status(200).json(staff);
  } catch (error) {
    console.log("Error displaying staff:", error);
    res.status(500).json({ error: "Server Error" });
  }
  finally{
    
      await client.close();
    
  }
});

const updateStaffSchema = Joi.object({
  staffId: Joi.string().required().messages({
    "string.empty": "Staff ID is required",
    
  }),
  staffName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Staff name must be at least 2 characters long",
    "string.max": "Staff name cannot exceed 50 characters",
    
  }),
  specificCourse: Joi.array()
    .items(Joi.string().min(2).max(100))
    .min(1)
    .required()
    .messages({
      "array.min": "At least one course is required",
    
    }),
});


app.post("/updatestaff", async (req, res) => {
  let client;
  try {
    console.log("Received update request:", req.body); // Log incoming request
    
    const { error } = updateStaffSchema.validate(req.body, { abortEarly: false });

    if (error) {
      console.log("Validation error:", error.details);
      return res.status(400).json({ error: error.details.map((err) => err.message) });
    }

    client = await connect(); 
    const staffCol = client.db("Rencoders").collection("staffdetails"); 
    const { staffId, staffName, specificCourse } = req.body;

    console.log("Looking for staff with ID:", staffId);
    const existingStaff = await staffCol.findOne({ staffId });
    if (!existingStaff) {
      console.log("Staff not found with ID:", staffId);
      return res.status(404).json({ error: "Staff not found" });
    }

    const updatedStaff = {
      staffId,
      staffName,
      specificCourse
    };

    console.log("Updating staff with:", updatedStaff);
    const result = await staffCol.updateOne({ staffId }, { $set: updatedStaff });

    if (result.modifiedCount > 0) {
      console.log("Update successful");
      return res.status(200).json({ message: "Staff updated successfully", staff: updatedStaff });
    } else {
      console.log("No documents modified");
      return res.status(500).json({ error: "Failed to update staff" });
    }
  } catch (error) {
    console.log("Error while updating staff:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  finally {
    if (client) {
      await client.close();
    }
  }
});
// Update Staff Endpoint
// app.post("/updatestaff", async (req, res) => {
//   try {
//     const { error } = updateStaffSchema.validate(req.body, { abortEarly: false });

//     if (error) {
//       return res.status(400).json({ error: error.details.map((err) => err.message) });
//     }

//     client = await connect(); 
//     const staffCol = client.db("Rencoders").collection("staffdetails"); 
//     const { staffId, staffName, specificCourse } = req.body;

//     const existingStaff = await staffCol.findOne({ staffId });
//     if (!existingStaff) {
//       return res.status(404).json({ error: "Staff not found" });
//     }

//     const updatedStaff = {
//       staffId,
//       staffName,
//       specificCourse
//     };

//     const result = await staffCol.updateOne({ staffId }, { $set: updatedStaff });

//     if (result.modifiedCount > 0) {
//       return res.status(200).json({ message: "Staff updated successfully", staff: updatedStaff });
//     } else {
//       return res.status(500).json({ error: "Failed to update staff" });
//     }
//   } catch (error) {
//     console.log("Error while updating staff:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
//   finally{
//       await client.close();
    
//   }
// });


// Course Schema
const courseSchema = Joi.object({
  courseID: Joi.string().required().messages({
    "string.empty": "Course ID is required",
    
  }),
  courseName: Joi.string().required().messages({
    "string.empty": "Course name is required",
   
  }),
  coursePrice: Joi.number().positive().required().messages({
    "number.base": "Course price must be a number",
    "number.positive": "Course price must be positive",
   
  }),
  learningMode: Joi.string().valid('online', 'offline').required().messages({
    "any.only": "Learning mode must be either 'online' or 'offline'",

  }),
  duration: Joi.number().positive().required().messages({
    "number.base": "Duration must be a number",
    "number.positive": "Duration must be positive",

  }),
  trainers: Joi.array().items(
    Joi.object({
      staffId: Joi.string().required().messages({
        "string.empty": "Trainer staff ID is required",
        
      }),
      staffName: Joi.string().required().messages({
        "string.empty": "Trainer name is required",
        
      })
    })
  ).min(1).required().messages({
    "array.base": "Trainers must be an array",
    "array.min": "At least one trainer is required",
   
  })
});



// Add Course Endpoint with Joi Validation
app.post("/addcourse", async (req, res) => {
  try {
    const { error } = courseSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        error: error.details.map(err => err.message) 
      });
    }

    client = await connect();
    const courseCol = client.db("Rencoders").collection("courses");
    const { courseID } = req.body;

    const existingCourse = await courseCol.findOne({ courseID });
    if (existingCourse) {
      return res.status(400).json({ error: "Course already exists" });
    }

    const result = await courseCol.insertOne(req.body);

    if (result.insertedId) {
      return res.status(201).json({
        message: "Course added successfully",
        course: req.body
      });
    }
    return res.status(500).json({ error: "Failed to add course" });
  } catch (error) {
    console.log("Error while adding course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  finally{
    
      await client.close();
   
  }
});

app.post("/displaycourses", async (req, res) => {
  try {
     client = await connect();
    const courseCol = client.db("Rencoders").collection("courses");
    const courses = await courseCol.find({}).toArray();
    res.status(200).json(courses);
  } catch (error) {
    console.log("Error Displaying Courses:", error);
    res.status(500).json({ error: "Server Error" });
  }
  finally{
    
      await client.close();
    
  }
});

// Payment List Schema
const paymentListSchema = Joi.object({
  StudentId: Joi.string().required().messages({
    "string.empty": "Student ID is required",
    "any.required": "Student ID is required"
  }),
  courses: Joi.array().items(
    Joi.object({
      courseID: Joi.string().required().messages({
        "string.empty": "Course ID is required",
        "any.required": "Course ID is required"
      }),
      courseName: Joi.string().required().messages({
        "string.empty": "Course name is required",
        "any.required": "Course name is required"
      }),
      coursePrice: Joi.number().positive().required().messages({
        "number.base": "Course price must be a number",
        "number.positive": "Course price must be positive",
        "any.required": "Course price is required"
      }),
      duration: Joi.number().positive().required().messages({
        "number.base": "Duration must be a number",
        "number.positive": "Duration must be positive",
        "any.required": "Duration is required"
      })
    })
  ).min(1).required().messages({
    "array.base": "Courses must be an array",
    "array.min": "At least one course is required",
 
  }),
  amountPaid: Joi.number().positive().required().messages({
    "number.base": "Amount paid must be a number",
    "number.positive": "Amount paid must be positive",
  
  }),
  paymentDate: Joi.date().required().messages({
    "date.base": "Payment date must be a valid date",

  })
});

// Add Payment List Endpoint with Joi Validation
app.post("/addpaymentlist", async (req, res) => {
  try {
    const { error } = paymentListSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        error: error.details.map(err => err.message) 
      });
    }

   client = await connect();
    const paymentListCol = client.db("Rencoders").collection("paymentlist");

    const result = await paymentListCol.insertOne({
      studentId: req.body.StudentId,
      courses: req.body.courses,
      amountPaid: parseFloat(req.body.amountPaid),
      paymentDate: new Date(req.body.paymentDate)
    });

    if (result.insertedId) {
      return res.status(201).json({
        message: "Payment added successfully",
        paymentDetails: req.body
      });
    }
    return res.status(500).json({ error: "Failed to add payment" });
  } catch (error) {
    console.log("Error while adding payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  finally{
    
      await client.close();
    
  }
});

app.get("/displaypaymentlist", async (req, res) => {
  try {
     client = await connect();
    const paymentListCol = client.db("Rencoders").collection("paymentlist");
    const paymentList = await paymentListCol.find({}).toArray();
    res.status(200).json(paymentList);
  } catch (error) {
    console.log("Error Displaying Payment List:", error);
    res.status(500).json({ error: "Server Error" });
  }
  finally{
    
      await client.close();
    
  }
});



app.post("/courseschedule", async (req, res) => {
  try {
     client = await connect();
    const scheduleCol = client.db("Rencoders").collection("staffSchedules");
    const staffschedule = await scheduleCol.find({}).toArray();
    res.status(200).json(staffschedule);
  } catch (error) {
    console.log("Error fetching:", error);
    res.status(500).json({ error: "Server Error" });
  }
  finally{
  
      await client.close();
    
  }
});

// Schedule Schema
const scheduleSchema = Joi.object({
  staffId: Joi.string().required().messages({
    "string.empty": "Staff ID is required",
    
  }),
  staffName: Joi.string().required().messages({
    "string.empty": "Staff name is required",

  }),
  schedule: Joi.array().items(
    Joi.object({
      day: Joi.string().required().messages({
        "string.empty": "Day is required",
      
      }),
      courseID: Joi.string().required().messages({
        "string.empty": "Course ID is required",
       
      }),
      courseName: Joi.string().required().messages({
        "string.empty": "Course name is required",
      
      }),
      courseTime: Joi.string().required().messages({
        "string.empty": "Course time is required",
       
      }),
      trainers: Joi.array().items(
        Joi.object({
          staffId: Joi.string().required().messages({
            "string.empty": "Trainer staff ID is required",
     
          }),
          staffName: Joi.string().required().messages({
            "string.empty": "Trainer name is required",
            
          })
        })
      ).optional()
    })
  ).min(1).required().messages({
    "array.base": "Schedule must be an array",
    "array.min": "At least one schedule entry is required",
    "any.required": "Schedule is required"
  })
});
app.post('/uploadSchedule', async (req, res) => {
  try {
    const { error,value } = scheduleSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        error: error.details.map(err => err.message) 
      });
    }

     client = await connect();
    const schedulesCol = client.db("Rencoders").collection("staffSchedules");

    const result = await schedulesCol.insertOne(req.body);

    res.status(201).json({
      message: "Schedule uploaded successfully",
      scheduleId: result.insertedId,
    });
  } catch (error) {
    console.error("Error uploading schedule:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  finally{
    
      await client.close();
    
  }
});

const courseCompleteSchema = Joi.object({
  studentId: Joi.string().optional().messages({
    "string.empty": "Student ID is required"
  }),
  completionThreshold: Joi.number().positive().default(90).messages({
   
    "number.positive": "Completion threshold must be positive"
  })
});

app.post("/coursecomplete", async (req, res) => {
  try {
    const { error } = courseCompleteSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        error: error.details.map(err => err.message) 
      });
    }

    client = await connect();
    const studentCol = client.db("Rencoders").collection("studentdetails");
    const courseCompleteCol = client.db("Rencoders").collection("coursecomplete");

    const { studentId, completionThreshold = 90 } = req.body;

    if (studentId) {
      
    } else {
      const allStudents = await studentCol.find({}).toArray();
      
      const completionData = await Promise.all(allStudents.map(async (student) => {
        const totalDuration = student.courses.reduce((acc, course) => acc + (course.duration || 0), 0);
        const isComplete = totalDuration >= completionThreshold;
        
        return {
          studentId: student.studentId,
          studentName: student.studentname,
          totalDuration,
          isCourseComplete: isComplete,
          completionDate: isComplete ? new Date() : null
        };
      }));

      res.status(200).json({ students: completionData });
    }
  } catch (error) {
    console.log("Error while checking course completion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  finally{
    
      await client.close();
    
  }
});

app.post("/attendance", async (req, res) => {
  try {
     client = await connect();
    const attendanceCol = client.db("Rencoders").collection("attendance");
    const allAttendanceRecords = await attendanceCol.find({}).toArray();
    res.status(200).json(allAttendanceRecords);
  } catch (error) {
    console.log("Error fetching:", error);
    res.status(500).json({ error: "Server Error" });
  }
  finally{
  
      await client.close();
    
  }
});




app.post('/countall', authenticateTokens, async (req, res) => {
  const client = await connect();
  const db = client.db("Rencoders");
  const studentCollection = db.collection("studentdetails");
  const staffCollection = db.collection("staffdetails");

  try {
    const [countstd, countstaff] = await Promise.all([
      studentCollection.countDocuments(),
      staffCollection.countDocuments()
    ]);

    res.json({ 
      success: true, 
      studentCount: countstd, 
      staffCount: countstaff 
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    await client.close();
  }
});



//ticket


const ticketSchema = Joi.object({
  title: Joi.string().required(),
  createdByRole: Joi.string().valid('support', 'admin').required(),
  createdByRoleID: Joi.string().required(),
  assignedToRole: Joi.string().valid('support', 'admin').required(),
  assignedToRoleID: Joi.string().required(),
  chats: Joi.array().items(
    Joi.object({
      senderId: Joi.string().required(),
      senderRole: Joi.string().valid('support', 'admin').required(),
      message: Joi.string().required(),
      timestamp: Joi.date().iso().required()
    })
  ).min(1).required()
});

app.post('/createTicket', async (req, res) => {
  let client;

  try {
    // Validate input
    const { error } = ticketSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: error.details.map(err => err.message)
      });
    }

    client = await connect();
    const db = client.db('Rencoders');
    const ticketsColl = db.collection('tickets');

    const {
      title,
      createdByRole,
      createdByRoleID,
      assignedToRole,
      assignedToRoleID,
      chats
    } = req.body;

    const ticket = {
      _id: `ticket_${uuidv4()}`,
      title,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        role: createdByRole,
        roleID: createdByRoleID
      },
      assignedTo: {
        role: assignedToRole,
        roleID: assignedToRoleID
      },
      chats: chats
    };

    const result = await ticketsColl.insertOne(ticket);

    if (result.insertedId) {
      return res.status(201).json({
        message: 'Ticket created successfully',
        ticket
      });
    } else {
      return res.status(500).json({ error: 'Failed to create ticket' });
    }
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (client) await client.close();
  }
});





//update ticket 
const updateSchema = Joi.object({
  title: Joi.string(),
  status: Joi.string().valid('open', 'closed', 'pending', 'resolved'),
  assignedToRoleID: Joi.string(),
  chats: Joi.array().items(
    Joi.object({
      senderId: Joi.string().required(),
      senderRole: Joi.string().valid('support', 'admin').required(),
      message: Joi.string().required(),
      timestamp: Joi.date().iso().required()
    })
  )
});
app.post('/updateTicket/:ticketId', async (req, res) => {
  let client;
  try {
    const { error } = updateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: error.details.map(err => err.message)
      });
    }

    const { ticketId } = req.params;
    client = await connect();
    const db = client.db('Rencoders');
    const ticketsColl = db.collection('tickets');

    const updateFields = { ...req.body, updatedAt: new Date().toISOString() };

    if (req.body.chats) {
      const existing = await ticketsColl.findOne({ _id: ticketId });
      if (!existing) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      updateFields.chats = [...existing.chats, ...req.body.chats];
    }

    const result = await ticketsColl.updateOne(
      { _id: ticketId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket updated successfully' });

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (client) await client.close();
  }
});

//get ticket

app.post('/getTicket/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  let client;

  try {
    client = await connect();
    const db = client.db('Rencoders');
    const ticketsColl = db.collection('tickets');

    const ticket = await ticketsColl.findOne(
      { _id: ticketId },
      {
        projection: {
          _id: 0,               
          title: 1,
          createdByRole: 1,
          createdByRoleID: 1,
          assignedToRole: 1,
          assignedToRoleID: 1,
          chats: 1
        }
      }
    );

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (client) await client.close();
  }
});

// create new chat
const chatSchema = Joi.object({
  message: Joi.string().trim().min(1).required(),
  timestamp: Joi.date().iso().required(),
  senderId: Joi.string().required(),
  senderRole: Joi.string().valid("admin", "support").required()
});

// Add chat to a ticket
app.post("/addChat/:ticketId", async (req, res) => {
  const { ticketId } = req.params;
  const { message, timestamp, senderId, senderRole } = req.body;

  // Validate body input
  const { error } = chatSchema.validate({ message, timestamp, senderId, senderRole });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let client;
  try {
    client = await connect();
    const db = client.db("Rencoders");
    const ticketsCollection = db.collection("tickets");

    // Check ticket exists and its statu
    const ticket = await ticketsCollection.findOne({_id: ticketId });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.status.toLowerCase() === "closed") {
      return res.status(403).json({ error: "Ticket is closed. Cannot add new chats." });
    }

    const chatData = {
      senderId,
      senderRole,
      message,
      timestamp
    };

    const result = await ticketsCollection.updateOne(
      { _id: ticketId },
      { $push: { chats: chatData } }
    );

    return res.status(200).json({ message: "Chat added successfully", chat: chatData });
  } catch (err) {
    console.error("Error adding chat:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) await client.close();
  }
});


const ticketIdSchema = Joi.object({
  ticketId: Joi.string().required()
});

app.post('/getChats', async (req, res) => {
  const { ticketId } = req.body;

  // Validate request body
  const { error } = ticketIdSchema.validate({ ticketId });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let client;
  try {
    client = await connect();
    const db = client.db("Rencoders");
    const ticketsCollection = db.collection("tickets");

    // Find ticket by ticketId (_id in your DB) and project only the chats field
    const ticket = await ticketsCollection.findOne(
      { _id: ticketId },
      { projection: { chats: 1, _id: 0 } }
    );

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    return res.status(200).json({ chats: ticket.chats || [] });
  } catch (err) {
    console.error("Error fetching chats:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) await client.close();
  }
});

app.get('/getAllTickets', async (req, res) => {
  let client;

  try {
    client = await connect();
    const db = client.db('Rencoders');
    const ticketsColl = db.collection('tickets');

    const tickets = await ticketsColl.find({}).toArray();

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (client) await client.close();
  }
});

app.post("/support/addChat/:ticketId", async (req, res) => {
  const { ticketId } = req.params;
  const { message, timestamp, senderId, senderRole } = req.body;

  if (senderRole.toLowerCase() !== "support") {
    return res.status(403).json({ error: "Only support can use this endpoint." });
  }

  const { error } = chatSchema.validate({ message, timestamp, senderId, senderRole });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let client;
  try {
    client = await connect();
    const db = client.db("Rencoders");
    const ticketsCollection = db.collection("tickets");

    const ticket = await ticketsCollection.findOne({ _id: ticketId });
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.status.toLowerCase() === "closed") {
      return res.status(403).json({ error: "Ticket is closed. Cannot add new chats." });
    }

    const chatData = { senderId, senderRole, message, timestamp };

    await ticketsCollection.updateOne(
      { _id: ticketId },
      { $push: { chats: chatData } }
    );

    return res.status(200).json({ message: "Support chat added successfully", chat: chatData });
  } catch (err) {
    console.error("Error adding support chat:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) await client.close();
  }
});



// Validation schema
const chatSchemas = Joi.object({
  message: Joi.string().required(),
  timestamp: Joi.string().isoDate().required(),
  senderId: Joi.string().required(),
  senderRole: Joi.string().valid('admin', 'support').required()
});

app.post("/admin/addChat/:ticketId", async (req, res) => {
  const { ticketId } = req.params;
  const { message, timestamp, senderId, senderRole } = req.body;

  // Validate sender role
  if (senderRole.toLowerCase() !== "admin") {
    return res.status(403).json({ 
      error: "Only admin users can send messages through this endpoint" 
    });
  }

  console.log("Received payload:", req.body);

  // Validate request body
  const { error } = chatSchemas.validate({ message, timestamp, senderId, senderRole });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let client;
  try {
    client = await connect();
    const db = client.db("Rencoders");
    const ticketsCollection = db.collection("tickets");

    // Check if ticket exists
    const ticket = await ticketsCollection.findOne({ 
      _id: ticketId,
      "assignedTo.role": "admin",
      "assignedTo.roleID": senderId
    });

    if (!ticket) {
      return res.status(404).json({ 
        error: "Ticket not found or you're not assigned to this ticket" 
      });
    }

    if (ticket.status.toLowerCase() === "closed") {
      return res.status(403).json({ 
        error: "Ticket is closed. Cannot add new messages." 
      });
    }

    // Create chat object with proper naming
    const chatMessage = {
      senderId,
      senderRole,
      message,
      timestamp,
      read: false // Track read status
    };

    // Update ticket with new message
    const result = await ticketsCollection.updateOne(
      { _id: ticketId },
      { 
        $push: { chats: chatMessage },
        $set: { updatedAt: new Date().toISOString() }
      }
    );

    if (result.modifiedCount === 1) {
      return res.status(200).json({ 
        success: true,
        message: "Message sent successfully",
        chat: chatMessage
      });
    } else {
      return res.status(500).json({ 
        error: "Failed to update ticket with new message" 
      });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ 
      error: "Internal server error" 
    });
  } finally {
    if (client) await client.close();
  }
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
console.log("Connected to MongoDB");
});
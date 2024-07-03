const express = require('express')
const app = express()
const port = 5000
let USER_ID_COUNTER = 1;
const { auth } = require("./middleware");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const SECRET_KEY = 'PIKACHU'; 
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const cors = require('cors');
app.use(cors());


const USERS = [ ];


const problems = [
  {
    problemId: 1,
    title: "Max Element in array",
    acceptance: "52%",
    difficulty: "Easy",
    description:
      "Given an array of integers, your task is to find and return the maximum element present in the array. The array will have at least one element.",
    testcases: [
      {
        input: "[1,2,3,4,5]",
        output: "5"
      },
      {
        input: "[10,9,8,7]",
        output: "10"
      }
    ],
    checktestcases: [
      {
        input: "[1,2,3]",
        output: "3"
      },
      {
        input: "[5,4,3,2,1]",
        output: "5"
      }
    ]
  },
  {
    problemId: 2,
    title: "Two Sum",
    acceptance: "65%",
    difficulty: "Easy",
    description:
      "Given an array of integers and a target integer, return the indices of the two numbers that add up to the target. Each input would have exactly one solution.",
    testcases: [
      {
        input: "[2,7,11,15], target=9",
        output: "[0,1]"
      },
      {
        input: "[3,2,4], target=6",
        output: "[1,2]"
      }
    ],
    checktestcases: [
      {
        input: "[1,2,3,4], target=7",
        output: "[2,3]"
      },
      {
        input: "[5,6,7,8], target=13",
        output: "[1,3]"
      }
    ]
  },
  {
    problemId: 3,
    title: "Palindrome Check",
    acceptance: "72%",
    difficulty: "Easy",
    description:
      "Given a string, check if it reads the same forward and backward, i.e., check if it is a palindrome. Return true if it is a palindrome and false otherwise.",
    testcases: [
      {
        input: "\"racecar\"",
        output: "true"
      },
      {
        input: "\"hello\"",
        output: "false"
      }
    ],
    checktestcases: [
      {
        input: "\"level\"",
        output: "true"
      },
      {
        input: "\"algorithm\"",
        output: "false"
      }
    ]
  },
  {
    problemId: 4,
    title: "Merge Intervals",
    acceptance: "48%",
    difficulty: "Medium",
    description:
      "Given a collection of intervals, merge all overlapping intervals and return the merged intervals as an array of arrays.",
    testcases: [
      {
        input: "[[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]"
      },
      {
        input: "[[1,4],[4,5]]",
        output: "[[1,5]]"
      }
    ],
    checktestcases: [
      {
        input: "[[2,5],[1,3],[6,8]]",
        output: "[[1,5],[6,8]]"
      },
      {
        input: "[[1,2],[3,4]]",
        output: "[[1,2],[3,4]]"
      }
    ]
  },
  {
    problemId: 5,
    title: "Longest Substring Without Repeating Characters",
    acceptance: "62%",
    difficulty: "Medium",
    description:
      "Given a string, find the length of the longest substring without repeating characters.",
    testcases: [
      {
        input: "\"abcabcbb\"",
        output: "3"
      },
      {
        input: "\"bbbbb\"",
        output: "1"
      }
    ],
    checktestcases: [
      {
        input: "\"pwwkew\"",
        output: "3"
      },
      {
        input: "\"abcdefg\"",
        output: "7"
      }
    ]
  },
  {
    problemId: 6,
    title: "Find Peak Element",
    acceptance: "55%",
    difficulty: "Medium",
    description:
      "A peak element in an array is an element that is strictly greater than its neighbors. Given an input array, find a peak element and return its index. The array may contain multiple peaks; return the index of any one of the peaks.",
    testcases: [
      {
        input: "[1,2,3,1]",
        output: "2"
      },
      {
        input: "[1,2,1,3,5,6,4]",
        output: "5"
      }
    ],
    checktestcases: [
      {
        input: "[1,2,3,4,3,2,1]",
        output: "3"
      },
      {
        input: "[1,3,5,7,9]",
        output: "4"
      }
    ]
  },
  {
    problemId: 7,
    title: "Word Search",
    acceptance: "40%",
    difficulty: "Hard",
    description:
      "Given a 2D grid of characters and a word, determine if the word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where 'adjacent' cells are those horizontally or vertically neighboring.",
    testcases: [
      {
        input: "[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word='ABCCED'",
        output: "true"
      },
      {
        input: "[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word='SEE'",
        output: "true"
      }
    ],
    checktestcases: [
      {
        input: "[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word='ABCB'",
        output: "false"
      },
      {
        input: "[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word='ABCEF'",
        output: "false"
      }
    ]
  },
  {
    problemId: 8,
    title: "Median of Two Sorted Arrays",
    acceptance: "29%",
    difficulty: "Hard",
    description:
      "Given two sorted arrays, find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    testcases: [
      {
        input: "[1,3], [2]",
        output: "2.0"
      },
      {
        input: "[1,2], [3,4]",
        output: "2.5"
      }
    ],
    checktestcases: [
      {
        input: "[1,2,3,4], [5,6,7,8]",
        output: "4.5"
      },
      {
        input: "[], [1]",
        output: "1.0"
      }
    ]
  },
  {
    problemId: 9,
    title: "N-Queens",
    acceptance: "42%",
    difficulty: "Hard",
    description:
      "The N-Queens problem is to place N chess queens on an N×N chessboard so that no two queens threaten each other. Given an integer N, return all distinct solutions to the N-Queens puzzle.",
    testcases: [
      {
        input: "4",
        output: "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]"
      },
      {
        input: "1",
        output: "[[\"Q\"]]"
      }
    ],
    checktestcases: [
      {
        input: "8",
        output: "[[\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\"],[\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\"],[\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\"],[\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\"],[\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\"],[\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\"],[\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\"],[\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\",\"Q\"]]"
      },
      {
        input: "2",
        output: "[[\"Q.\",\".Q\"],[\".Q\",\"Q.\"]]"
      }
    ]
  },
  {
    problemId: 10,
    title: "Decode Ways",
    acceptance: "32%",
    difficulty: "Medium",
    description:
      "A message containing letters from A-Z can be encoded into numbers. Given a string containing only digits, count the number of ways to decode it.",
    testcases: [
      {
        input: "\"226\"",
        output: "3"
      },
      {
        input: "\"12\"",
        output: "2"
      }
    ],
    checktestcases: [
      {
        input: "\"12345\"",
        output: "3"
      },
      {
        input: "\"1111\"",
        output: "5"
      }
    ]
  }
];

const SUBMISSIONS = []

app.use(express.json());

app.post('/login', (req, res) => {
       flag=0;
       if(req.is('application/json')){
           const body = req.body;

           let flag=0;
          for(let i=0;i<USERS.length ; i++){
            if(body.email == USERS[i].email){
                if(body.password == USERS[i].password){
                    flag=1;
                    console.log(USERS[i]);
                   
                   const token =  jwt.sign({id:USERS[i].id}, SECRET_KEY);
                    res.status(200).json({token})
                    return 
                }else{
                   return res.status(403).json({message:"Password is Incorrect"})
                }

            }
          }

          if(flag==0){
            res.status(403).json({error:"The email does not exist"})
          }

          
       }else{
          res.status(400).json({error:"Only JSON request accepted"})
       }
})

app.post('/signup', (req, res) => {
     if(req.is('application/json')){
          const body = req.body;
 
          const {email , password} = req.body;
          if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
          }


          let flag = 1;
          for (let i = 0; i < USERS.length; i++) {
             if(body.email == USERS[i].email){
                  flag = 0;
                  break;
             }
        }

        if(flag==0){
            res.status(409).json({message:"The email is already used."})
        }else{

            USERS.push({email:body.email , password: body.password , id:USER_ID_COUNTER++});
            res.status(200).json({
              message:"Success"
            })
        }
          
  
     }else{
           res.status(415).json({message:"The request must be in JSON"})
     }
  })

  app.get('/problems', (req, res) => {
      res.status(200).send(problems)
  })


  app.get('/problem/:id' , (req,res) => {
    const id = req.params.id;
    for(let i=0;i<problems.length;i++){
      if(id==problems[i].problemId){
        return res.status(200).json(problems[i])
      }
    }
    return res.status(403).json({})
  })


  app.post('/submission' , auth , async (req,res) =>{
         
    const problemid = req.body.problemid;
    const submission = req.body.submission;
    const checktestcases = req.body.checktestcases;
    const status_code = req.body.status;
    const exp_output = req.body.exp_output;
    const obs_output = req.body.obs_output;
    console.log(req.body);

   
    if(status_code=="AC"){
      SUBMISSIONS.push(
        {
          problemid : problemid ,
          submission:submission ,
          userid : req.userId ,
          status : "AC" ,
          exp_output ,
          obs_output
        }
      )
      console.log(SUBMISSIONS)
      return res.status(200).json({status:"AC"})
    }else if(status_code=="WA"){
      SUBMISSIONS.push(
        {
          problemid : problemid ,
          submission:submission ,
          userid : req.userId ,
          status : "WA",
          exp_output ,
          obs_output
        }
      )
      console.log(SUBMISSIONS)
      return res.status(200).json({status:"WA"})
    }else if(status_code=="Error"){
      SUBMISSIONS.push(
        {
          problemid : problemid ,
          submission:submission ,
          userid : req.userId ,
          status : "Error",
          exp_output ,
          obs_output
        }
      )
      console.log(SUBMISSIONS)
      return res.status(200).json({status:"Error"})
    }

  })

app.get('/submission/:pid', auth , (req, res) => {

    const problemid = req.params.pid;
    const userid = req.userId;
    const SUBS = [];
    for(let i=0;i<SUBMISSIONS.length;i++){
      if(SUBMISSIONS[i].problemid == problemid && SUBMISSIONS[i].userid == userid){
        SUBS.push(SUBMISSIONS[i])
      }
    }

    res.status(200).send(SUBS)
  })


  app.get('/me' , auth , (req,res) =>{
    const userid = req.userId;
    for(let i=0;i<USERS.length;i++){
      if(userid == USERS[i].id){
        return res.status(200).json(USERS[i])
      }
    }
    return res.status(400).json({message:"User not found"})
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
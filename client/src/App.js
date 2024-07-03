import { useState , useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes,  useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Login(){

  const [email , setemail ] = useState("");
  const [password , setpassword ] = useState("");

  return(
    <div >
      <Nav />
      <div id="loginPage">
      <h2> LOG IN </h2>
      <div id="loginBoxCont">
      <input type="text" placeholder="Email"  onChange={(e) => {setemail(e.target.value)} }/>
     <input type="text" placeholder="Password" onChange={(e) => {setpassword(e.target.value)}}/>
     <input id="loginbtn" type="submit" value="LOGIN" onClick={ async (e) => {
              const response = await  fetch('http://localhost:5000/login' , {
                  method:"POST" , 
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body:JSON.stringify({
                    email:email ,
                    password:password
                  }),
                });

                const json = await response.json();
                const token = json.token;
                localStorage.setItem('token', token);
                // console.log(token);
     }} />
      </div>
      </div>
    </div>
  );
}

function SignUp(){

   const [email , setemail ] = useState("");
   const [password , setpassword ] = useState("");

  return(
    <div>
       <Nav />
       <div id="signupPage">
        <h2> SIGN UP</h2>
        <div id="signupBoxCont">
        <input type="text" placeholder="email" onChange={(e) => {setemail(e.target.value)}} />
        <input type="password" placeholder="password" onChange={(e) => {setpassword(e.target.value)}}/>
        <input id="signupbutton" type="submit" value="SIGNUP"   onClick={async (e) => {
            const response = await fetch('http://localhost:5000/signup', {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: email,
                password: password,
              }),
            });

            const json = await response.json();
            console.log(json);
          }} />
        </div>
       </div>

   </div>
  );
}


function ProblemSetPage(){


  const [problems , setproblems ] = useState([])


  const init = async () => {
    const response = await fetch('http://localhost:5000/problems' , {
      method:"GET"
    })

    const problemsarray = await response.json();
    setproblems(problemsarray)
  }


  useEffect(() => {
    init()
  }, []);


  // const [problems , setproblems] = useState(Intialproblems)



  return(
     <div id="problemsPage">
       <Nav />
       {/* {problems.map(problem => <RenderSingleProblemRow title={problem.title} acceptance={problem.acceptance} difficulty={problem.difficulty}/>)} */}
         <div id="problemscont">
          <tr id="headingrow">
            <td id="td1"> Title </td>
            <td id="td2"> Acceptance </td>
            <td id="td3"> Difficulty </td>
          </tr>
         {problems.map(problem => <RenderSingleProblemRow  problem={problem}/>)}
         </div>
       
     </div>
  );
}


function RenderSingleProblemRow( {problem}){

  const navigate = useNavigate();

  const handleClick = ()=>{
    navigate(`/problems/${problem.problemId}`)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'green';
      case 'Medium':
        return 'orange';
      case 'Hard':
        return 'red';
      default:
        return 'black'; // Default color
    }
  };


  return(
          <tr >
            <td id="td1" onClick={handleClick}> {problem.problemId}. {problem.title} </td>
            <td id="td2"> {problem.acceptance} </td>
            <td id="td3" style={{ color: getDifficultyColor(problem.difficulty) , fontWeight:700 }}> {problem.difficulty} </td>
          </tr>  
  );
}

function ProblemPage(){


  const [problem, setProblem] = useState({
    problemId: '',
    title: '',
    description: '',
    testcases: [] ,
    checktestcases:[ {
      input: '',
      output: ''
    }]
  });

  const [submission , setsubmission ] = useState("");
  const [pastsubmission , setpastsubmission ] = useState([]);

  const { pid } = useParams() ;
   const init = async () => {
      const response = await fetch(`http://localhost:5000/problem/${pid}`, {
        method:"GET"
      })

      const json = await response.json();
      setProblem(json);

      const response2 = await fetch(`http://localhost:5000/submission/${pid}`, {
        method:"GET" ,
        headers: {
          "authorization": localStorage.getItem("token")
        }
      })

      const json2 = await response2.json();
      setpastsubmission(json2);
      

   }


  useEffect(() => {
    init()
  }, []);


  return(
     <div id="singlprobpage">
      <Nav />
      <div id="single-prob-page-cont">

      
      <div id="problem-info">
      <p id="title"> {problem.problemId}. {problem.title} </p>
      <p id="description"> {problem.description} </p>
      {problem.testcases.map((testcase,index) => (
        <div id="example-box">
          <p> Example {index+1} </p>
          <p > Input : {testcase.input}</p>
          <p> Output :  {testcase.output}  </p>
        </div>
      ))}

   
        <div id="example-box">
          <p> Write a C++ program for this question with this input </p>
          <p > Input : {problem.checktestcases[0].input}</p>
        </div>
 

      <div>
        <h2> PAST SUBMISSIONS</h2>
        {pastsubmission.map((submission) => (
      <h4>{submission.status}</h4>
  ))}
      </div>
      </div>

      <div id="textarea">
          <h2> Code </h2>
          <textarea  id="coding-area" rows="15" cols="40" onChange={(e) => {setsubmission(e.target.value)}}/>
          <button id="run-btn" onClick={ async (e) => {
                            // console.log({submission:submission , checktestcases:problem.checktestcases})
                            
                            //  `http://localhost:5005/  
                            // can change the url to your virtual machince url end points running on cloud.
                            
                           const response1 = await fetch(`http://localhost:5005` , {
                            method:"POST" ,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({submission:submission , checktestcases:problem.checktestcases})
                             })
                          
                             const json1 = await response1.json();

                            // console.log(json1); 
                            
                             const status_code = json1[0].status;
                             const exp_output= json1[0].output_expected;
                             const obs_output = json1[0].output_observed;

               const response = await fetch(`http://localhost:5000/submission` , {
                method:"POST" ,
                headers: {
                  "authorization": localStorage.getItem("token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({problemid: pid ,submission:submission , checktestcases:problem.checktestcases , status: status_code , 
                    exp_output , obs_output
                 })
               })

               const json = await response.json();
              

               if(json1[0].status=="AC"){
                window.alert(status_code)
               }else if(json1[0].status=="WA"){
                window.alert(json1[0].status)
               }else{
                 window.alert(json1[0].output_observed + "\n"  + json1[0].error)
               }
              // console.log(json); 
             
              
               
              


          }}> RUN </button>
      </div>

      </div>

     </div>
  );
}

function Home(){
  return(
   <div id="Home-page">
    <Nav />
     <div id="Home-page-cont"> 
      <h2> A New Way to Learn </h2>
     </div>
   </div>
  );
}


function Nav(){
  return(
    <div id="navigation">
    <Link to="/">
    <p> CodeHunt </p>
       </Link>

       <Link to="/problemset">
    <p> Problems</p>
       </Link>

       <Link to="/signup">
    <p> SignUp </p>
       </Link>

       <Link to="/login">
    <p> LogIn </p>
       </Link>
   
    </div>
  );
}



function App() {
  return (
    <Router>
    <div className="App" >
        <Routes>
        <Route path="/" element={<ProblemSetPage />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/problemset" element={<ProblemSetPage />}/>
          <Route path="/problems/:pid" element={<ProblemPage />}/>
        </Routes>
    </div>
    </Router>
  );
}

export default App;

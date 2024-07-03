const express = require('express')
const app = express()
const port = 5005
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

app.post('/', (req, res) => {
      const submission = req.body.submission;
      const checktestcases = req.body.checktestcases;
      console.log(req.body);
      const testcase1 = checktestcases[0];
      const results = []

     const ts_input = testcase1.input;
     const ts_output = testcase1.output

    // Write the C++ code to a file
    const fileName = 'submission.cpp';
    require('fs').writeFileSync(fileName, submission);

    // Compile and execute the C++ code with input as command-line argument
    exec(`g++ ${fileName} -o ${fileName.replace('.cpp', '')} && ${__dirname}/${fileName.replace('.cpp', '')}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Compilation or execution error: ${stderr}`);
            console.log({ input:ts_input, outputexpected:ts_output , outputobserved: "Compilation or execution error", error:stderr  ,  status:'Error' });
            results.push({ input:ts_input, output_expected:ts_output , output_observed: "Compilation or execution error", error:stderr, status:'Error'  })
            return res.json(results);
        }

        const actualoutput = stdout.trim();
        const status = (actualoutput === ts_output) ? 'AC' : 'WA';
        // results.push({ input, output: actualoutput, status });
        // console.log(`Output: ${stdout}`);
        console.log({ input:ts_input, outputexpected:ts_output , outputobserved: actualoutput, status });
        results.push({ input:ts_input, output_expected:ts_output , output_observed: actualoutput, status ,})
        res.json(results);
    });
});

   






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
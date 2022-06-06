import React from "react";
import { Button, DatePicker, version } from "antd";
import { Get ,Post} from "../Services/CommonService";
import { getCookie } from "../Services/cookies";
import { getLevel } from "../Services/PackageServices/StartServices";

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: [],
      result:"",
    };
    console.log(this);
    console.log(props);
  }

  sendRequest = () => {
getLevel(getCookie()).then(res=>{
  console.log(res)
})
  }
    // let request = {
    //   "Access-Control-Allow-Origin": null,
    //   "Access-Control-Allow-Credentials": true,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: "GET",
    // };


    //能用
    // fetch(`https://localhost:44375/dream/skills/create/`+"Rich", {
    //   method: "GET",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((response) => {
    //     let res = response.json();
    //     console.log(res);
    //     return res;
    //   })
    //   .then((result) => {
    //     console.log("result:", result);
    //     this.setState({
    //       result: result,
    //     });
    //   });

    // fetch("https://localhost:44375/dream/skills/list", {
    //   method: "GET",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    // })

      
//     fetch("https://localhost:44375/term/characters/create", {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         CharecterName: "test444",
// OccurrenceFrequency: 0,
// PeopleDetails: "string"
//       }),
     
//     })
// Post("https://localhost:44375/term/characters/create",{
//           CharecterName: "封装之后测试好不好使",
//   OccurrenceFrequency: 0,
//   PeopleDetails: "string"
//         })
//       .then((response) => {
//         console.log("response",response);
//         return response.json();
//       })
//       .then((result) => {
//         console.log("result",result);
//         if(result){

//         }
//       })
//       .catch((err) => {
//         console.log("Fetch error:%S", err);
//       });


//   Get("https://localhost:44375/term/characters/list")
//   .then((response) => {
//     let res = response.json();
//     console.log(res);
//     return res;
//   })
//   .then((result) => {
//     console.log("result:", result);
//     this.setState({
//       response: result,
//     });
//   });

// };

    // fetch('https://localhost:44375/dream/skills/list', request).then(
    //   (reponse) => {
    //     console.log(reponse);
    //     if (reponse) this.setState({ reponse: reponse });
    //     else alert("Holy Shit");
    //   }    ).then(result=>{
    //     console.log("result:",result);
    //   }).catch(error=>{
    //     console.log('error:',error);
    //   })
  //};
  render() {
    return (
      <div style={{ padding: 20 }}>
        <h1>version:{version}</h1>
        <Button type="primary" onClick={this.sendRequest}>
          Fetch
        </Button>
        <div>result:{this.state.result}</div>
        <div>fetch:{this.state.response?.map((e,i)=>
          <div id={`a-`+i}>{e.CharecterName}</div>
          )}</div>
      </div>
    );
  }
}

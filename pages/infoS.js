import React, {useEffect, useState} from 'react'
//import React, {useState} from 'react'
import { getElections } from '../lib/civic'
import {getVoterInfo} from '../lib/civic'
import {getRepresentativeByAddress} from '../lib/civic'
import {getRepresentativeByDivision} from '../lib/civic'

//import Button from 'react-bootstrap/Button';
//import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

// Component Imports
import Footer from '../components/footer'
import NavBar from '../components/navbar'
import BlockY from '../components/blockY'
import LoginForm from '../components/formlogin'
import { Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { ListGroupItem } from 'react-bootstrap';


//Need to learn more html and css
var stylesrob = {
    base:{
        height:"900%",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    //...other styles...
};



//main class with fetch and parse functions
class politicalDataTool extends React.Component {
    constructor (props) {
        super (props)

        this.state = {
            officials: "",
            address: "",
            city: "",
            state: "", 
            zip: "",
            party: ""
        }


        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSubmit2 = this.handleSubmit2.bind(this)
     

    }

    handleSubmit2 = async (e) => {
        console.log("GOT HERE")
        e.preventDefault()

        
        const body2 = {           
            streetnamenew: e.currentTarget.streetnamenew.value,
            streetname1new: e.currentTarget.streetname1new.value,
            streetname2new: e.currentTarget.streetname2new.value,
            
            citynew: e.currentTarget.citynew.value,
            statenew: e.currentTarget.statenew.value,
            zipcodenew: e.currentTarget.zipcodenew.value         

        }

        //I am still trying to understand divisions and find list with all of them on the net
        const dataResultNew = await getRepresentativeByDivision(body2.streetnamenew + '%2F'+ body2.streetname1new + '%3A'+ body2.streetname2new  + '%2F' + body2.citynew + '%3A'+ body2.statenew)
                console.log("INFO: ###GET VOTER INFO FORM2", dataResultNew)
    }   
    
    
    //function to handle the form submit
      handleSubmit = async (e) => {
        console.log("GOT HERE")
        
        e.preventDefault()       

        const body = {
            streetname: e.currentTarget.streetname.value,
            streetname1: e.currentTarget.streetname1.value,
            streetname2: e.currentTarget.streetname2.value,
            
            city: e.currentTarget.city.value,
            state: e.currentTarget.state.value,
            zipcode: e.currentTarget.zipcode.value
            

        }    

        //get voter info API          
        const dataResult = await getVoterInfo(body.streetname + '%20'+ body.streetname1 + '%20'+ body.streetname2  + '%20' + body.city + '%20'+ body.state + '%20' + body.zipcode)    
        alert(JSON.stringify(dataResult))
        console.log("GET VOTER INFO API CALL", dataResult)         
        const dataResult2 = await getElections () 
        console.log("GET ELECTIONS API CALL", dataResult2) 
            alert(JSON.stringify(dataResult2))
           
        //funtion that call getRepresentativeByAddress API in civic file created by mr. Yang
        const represult = await getRepresentativeByAddress (body.streetname + '%20'+ body.streetname1 + '%20'+ body.streetname2  + '%20' + body.city + '%20'+ body.state + '%20' + body.zipcode)     
        alert(JSON.stringify(represult))
        var repObj = (JSON.stringify(represult))
        var repJSON = JSON.parse(repObj)
          
        //Nested array with all officials data info  
        const officialsResultArray = []     
        for (let i = 0; i < repJSON.officials.length; i++) {
        officialsResultArray.push([repJSON.officials[i].name, repJSON.officials[i].phones, repJSON.officials[i].emails, repJSON.officials[i].urls])    

     
        }
    
        
          //This iterates through the division object and pushed into new array 'divisionsResultArray'
        const divisionsResultArray = []
            /* for (let i = 0; i < repJSON.divisions.length; i++) {
              //divisionsResultArray.push([repJSON.divisions[i][0], repJSON.divisions[i].name, repJSON.divisions[i].officeIndices])
              divisionsResultArray.push(JSON.parse(repJSON.divisions)[i])
        } */

        //
        for(const divis in repJSON.divisions)
        {
          //console.log(repJSON.divisions[divis].name);
          //diviP = JSON.parse(divis)
          //console.log(diviP)
          let diviString = (JSON.stringify(divis))
          console.log("divi string: ", diviString)
          divisionsResultArray.push([diviString, repJSON.divisions[divis].name, repJSON.divisions[divis].officeIndices])
          //divisionsResultArray.push(repJSON.divisions[divis])
          //divisionsResultArray.push(JSON.parse(repJSON.divisions[divis][i]))
        }
        



          //This was me trying to push the divisions object into and array to itereate through it - not having any luck
          // const divisionsCleanData = []
          //    for (let i = 0; i < divisionsResultArray.length; i++) {
          //       divisionsCleanData.push(divisionsResultArray[i])
              
          // }
          // console.log("divisionsCleanData array", divisionsCleanData)


          // This fetches 'offices' JSON object and push into nested array
          const officesDataResult = []
          for (let i = 0; i < repJSON.offices.length; i++) {
              officesDataResult.push([repJSON.offices[i].name, repJSON.offices[i].divisionId, repJSON.offices[i].levels, repJSON.offices[i].roles, repJSON.offices[i].officialIndices])

              
          }
          console.log("officesDataResult array &&&&&", officesDataResult)
          

        
          // This is me working on setting maps
            const officesMap = new Map()
            const key = {}
            const value    = {}         
          
          for (let j = 0; j < repJSON.offices.length; j++) {
              
              officesMap.set({ key1: repJSON.offices[j].officialIndices }, { key2: repJSON.offices[j].name })
              //myMap.set(value, { key2: repJSON.offices[j].officialIndices })
          }           
          
          console.log("MAP MOB++++++++++++++++", officesMap)  


   
   
        //This is where I set the states for polly cards
        this.setState( {officials: repJSON.officials[42].name})
        this.setState( {address: repJSON.officials[1].address[0].line1, city: repJSON.officials[1].address[0].city, state: repJSON.officials[1].address[0].state, zip: repJSON.officials[1].address[0].zip})
        this.setState( {party: repJSON.officials[42].party})
        
        
          //  ------------- {DEBUG LOGS} --------------------------
        console.log("GET REPS API CALL", repJSON) 
        console.log("one official: ", repJSON.officials[1])
        console.log("party: ", repJSON.officials[1].party)
        console.log("RAINEY party: ", repJSON.officials[42].party)
        console.log("RAINEY NAME: ", repJSON.officials[42].name)
        console.log("address: ", repJSON.officials[1].address[0].line1) 
        console.log("this.state.officials", this.state.officials)
        console.log("this.state.address", this.state.address)
        console.log("this.state.party", this.state.party)

        console.log("officialsResultArray #### ", officialsResultArray)
        console.log("divisionsResultArray ####", divisionsResultArray)
        console.log("index 2 divisions name ####", repJSON.divisions)

       

    }
    
    //This is where the front end starts
            
            render () {

                return (<>    
    
                    <div>
                          {/*<span className="absolute bottom-0 w-full mx-auto"><Footer /></span>*/}
                        <div className="h-screen"><NavBar />
                        <body onLoad="alert({data})">
                        <head><title>Info Search</title></head>
                        {/*<div className="h-screen"><NavBar /> </div>*/}
                        {/* <div
                            style={
                                {border: '2px solid red'}
                            }
                            >  
                            </div> */}
                
                
                
                    {/*I PLUCKED THIS CARD FROM REACT SITE*/}
                
                <Card style={{ width: '18rem', align: 'right' }}>
                  <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
                  <Card.Body>
                    <Card.Title>Polly Card</Card.Title>
                    <Card.Text>
                     Heres is a paper tiger pollycard
                    </Card.Text>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    { <ListGroupItem>{this.state.officials}</ListGroupItem> }
                    { <ListGroupItem>{this.state.address} , {this.state.city} , {this.state.state} {this.state.zip}</ListGroupItem>}
                    {<ListGroupItem>{this.state.party}  </ListGroupItem>}
                  </ListGroup>
                  <Card.Body>
                    <Card.Link href="#">Card Link</Card.Link>
                    <Card.Link href="#">Another Link</Card.Link>
                  </Card.Body>
                </Card>
                {/*I PLUCKED THIS CARD FROM REACT SITE*/}
                
                {/* <div class="cardstyle.card">
                  <img src="img_avatar.png" alt="Avatar" style={{width: '100%'}}></img>
                  <div class="cardstyle.container">
                    <h4><b>John Doe</b></h4>
                    <p>Architect & Engineer</p>
                  </div>
                </div>  */}
                
                               {/*    ********************  #THIS IS THE ORIGINAL FORM !!!  **************BOB */}
                
                
                        <div className="flex-container" style={stylesrob} /*style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', marginRight:"70%"}}*/  >
                           <form onSubmit={this.handleSubmit} >       
                
                              
                               <label>
                               Street Name:
                               <div><input name="streetname" type="text" style={{border: '2px solid red'}} /> </div>
                               <input name="streetname1" type="text" style={{border: '2px solid red'}} /> 
                               <input name="streetname2" type="text" style={{border: '2px solid red'}} />  </label>
                               <br /><br />
                              
                               <label>
                                City:
                               <input name="city" type="text" style={{border: '2px solid red'}} /></label>
                               <br /><br />
                              
                   
                     <label>
                     <h1><mark>State:</mark></h1>
                               <input name="state" type="text" style={{border: '2px solid red', backgroundcolor: 'powderblue', color: 'blue'}} /></label>
                               <br /><br />
                               <label>
                                   ZipCode: 
                               <input name="zipcode" type="text" style={{border: '2px solid red'}} /></label>
                               <br /><br />
                               {/* <input type="submit" onClick={() => setOfficial(official + 1)} value="go" style={{border: '2px solid red'}} />  */}
                               <input type="submit" value="go" style={{border: '2px solid red'}} /> 
                           </form>           
                            
                            </div>
                
                            
                            {/*    ********************  #THIS IS THE NEW FORM !!!  **************BOB */}
                
                
                
                
                
                            <div className="flex-container" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', marginRight:"70%"}} >
                                
                                <form onSubmit={this.handleSubmit2}  >            
                
                                
                                <label>
                                Street Name:
                                <div><input name="streetnamenew" type="text" style={{border: '2px solid red'}} /> 
                                <input name="streetname1new" type="text" style={{border: '2px solid red'}} /> 
                                <input name="streetname2new" type="text" style={{border: '2px solid red'}} />  </div></label>
                                <br /><br />
                                
                                <label>
                                    City:
                                <input name="citynew" type="text" style={{border: '2px solid red'}} /></label>
                                <br /><br />
                              
                   
                     <label>
                        <h1><mark>State:</mark></h1>
                                <input name="statenew" type="text" style={{border: '2px solid red', backgroundcolor: 'powderblue', color: 'blue'}} /></label>
                                <br /><br />
                                <label>
                                    ZipCode: 
                                <input name="zipcodenew" type="text" style={{border: '2px solid red'}} /></label>
                                <br /><br />
                                {/* <input type="submit2" value="go2" style={{border: '2px solid red'}} />  */}
                                <button type="submit" name="btn" value="submit2" style={{border: '2px solid purple'}}>
                                    BOOYAH PANCAKES :O
                                </button>
                                    </form>
                                    {/* <span className="absolute bottom-0 w-full mx-auto"><Footer /></span> */}
                            {/* <Footer /> */}
                                
                               
                
                
                                {/*    ********************  THIS IS THE NEW FORM END   **************BOB */}        
                
                
                                  </div> 
                
                              </body>       
                      
                
                         </div>
                    
                
                      </div>
                
                    
                    
                </>
               
                )}
               



            }      
            
    







export default politicalDataTool











// import React, {useEffect, useState} from 'react'
// //import React, {useState} from 'react'
// import { getElections } from '../lib/civic'
// import {getVoterInfo} from '../lib/civic'
// import {getRepresentativeByAddress} from '../lib/civic'
// import {getRepresentativeByDivision} from '../lib/civic'

// //import Button from 'react-bootstrap/Button';
// //import Card from 'react-bootstrap/Card';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Component Imports
// import Footer from '../components/footer'
// import NavBar from '../components/navbar'
// import BlockY from '../components/blockY'
// import LoginForm from '../components/formlogin'
// import { Card } from 'react-bootstrap';
// import { ListGroup } from 'react-bootstrap';
// import { ListGroupItem } from 'react-bootstrap';

// // var cardstyle = {

// //     card:{
// //     boxshadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
// //     transition: "0.3s",
// // },

// // cardhover: {
// //     boxshadow: "0 8px 16px 0 rgba(0,0,0,0.2)"

// // },

// // container: {
// //     padding: "2px 16px"
// // }



// // }




// var stylesrob = {
//     base:{
//         height:"900%",
//         width: "100%",
//         marginLeft: "auto",
//         marginRight: "auto"
//     },
//     //...other styles...
// };




// export default  function infoSTool({data}) {
//     //this.handleSubmit = this.handleSubmit.bind(this);
//     const [official, setOfficial] = useState(0)
    

//     // state = {

//     //     politician: '',
//     //     politician2: ''
    
//     // }
    
//     const handleSubmit2 = async (e) => {
//         console.log("GOT HERE")
//         e.preventDefault()

        
//         const body2 = {
//             //address: e.currentTarget.address.value,
//             streetnamenew: e.currentTarget.streetnamenew.value,
//             streetname1new: e.currentTarget.streetname1new.value,
//             streetname2new: e.currentTarget.streetname2new.value,
            
//             citynew: e.currentTarget.citynew.value,
//             statenew: e.currentTarget.statenew.value,
//             zipcodenew: e.currentTarget.zipcodenew.value            

//         }

//         const dataResultNew = await getRepresentativeByDivision(body2.streetnamenew + '%2F'+ body2.streetname1new + '%3A'+ body2.streetname2new  + '%2F' + body2.citynew + '%3A'+ body2.statenew)
//                 console.log("INFO: ###GET VOTER INFO FORM2", dataResultNew)
//     }   
    
    
//     const handleSubmit = async (e) => {
//         console.log("GOT HERE")
        
//         e.preventDefault()
//         // e.toString()
//         // .toLowerCase()

//         const body = {
//             //address: e.currentTarget.address.value,
//             streetname: e.currentTarget.streetname.value,
//             streetname1: e.currentTarget.streetname1.value,
//             streetname2: e.currentTarget.streetname2.value,
            
//             city: e.currentTarget.city.value,
//             state: e.currentTarget.state.value,
//             zipcode: e.currentTarget.zipcode.value
            

//         }
//         //console.log("BODY", e.currentTarget.address.value);
//         //alert(body.address)

//         const dataResult = await getVoterInfo(body.streetname + '%20'+ body.streetname1 + '%20'+ body.streetname2  + '%20' + body.city + '%20'+ body.state + '%20' + body.zipcode)    
//         alert(JSON.stringify(dataResult))
//         console.log("GET VOTER INFO API CALL", dataResult) //why do these console logs not work        
//         const dataResult2 = await getElections () 
//         console.log("GET ELECTIONS API CALL", dataResult2) //why do these console logs not work
//             alert(JSON.stringify(dataResult2))
           

//         const represult = await getRepresentativeByAddress (body.streetname + '%20'+ body.streetname1 + '%20'+ body.streetname2  + '%20' + body.city + '%20'+ body.state + '%20' + body.zipcode)        
//         alert(JSON.stringify(represult))
//         var repObj = (JSON.stringify(represult))
//         var repJSON = JSON.parse(repObj)         
//         // setState({ official: repJSON.officials[1]})       
//         console.log("GET REPS API CALL", repJSON) //why do these console logs not work
//         console.log("one official: ", repJSON.officials[1])
//             }    
    
//     return (<>    
    
//     <div>
//           {/*<span className="absolute bottom-0 w-full mx-auto"><Footer /></span>*/}
//         <div className="h-screen"><NavBar />
//         <body onLoad="alert({data})">
//         <head><title>Info Search</title></head>
//         {/*<div className="h-screen"><NavBar /> </div>*/}
//         {/* <div
//             style={
//                 {border: '2px solid red'}
//             }
//             >  
//             </div> */}



//     {/*I PLUCKED THIS CARD FROM REACT SITE*/}

// <Card style={{ width: '18rem', align: 'right' }}>
//   <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
//   <Card.Body>
//     <Card.Title>Card Title</Card.Title>
//     <Card.Text>
//       Some quick example text to build on the card title and make up the bulk of
//       the card's content.
//     </Card.Text>
//   </Card.Body>
//   <ListGroup className="list-group-flush">
//     <ListGroupItem>{official}</ListGroupItem>
//     <ListGroupItem>More rep info can be found on the polly card</ListGroupItem>
//     <ListGroupItem>This is rob trying to creare a polly card</ListGroupItem>
//   </ListGroup>
//   <Card.Body>
//     <Card.Link href="#">Card Link</Card.Link>
//     <Card.Link href="#">Another Link</Card.Link>
//   </Card.Body>
// </Card>
// {/*I PLUCKED THIS CARD FROM REACT SITE*/}

// {/* <div class="cardstyle.card">
//   <img src="img_avatar.png" alt="Avatar" style={{width: '100%'}}></img>
//   <div class="cardstyle.container">
//     <h4><b>John Doe</b></h4>
//     <p>Architect & Engineer</p>
//   </div>
// </div>  */}

//                {/*    ********************  #THIS IS THE ORIGINAL FORM !!!  **************BOB */}


//         <div className="flex-container" style={stylesrob} /*style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', marginRight:"70%"}}*/  >
//            <form onSubmit={handleSubmit} >       

              
//                <label>
//                Street Name:
//                <div><input name="streetname" type="text" style={{border: '2px solid red'}} /> </div>
//                <input name="streetname1" type="text" style={{border: '2px solid red'}} /> 
//                <input name="streetname2" type="text" style={{border: '2px solid red'}} />  </label>
//                <br /><br />
              
//                <label>
//                 City:
//                <input name="city" type="text" style={{border: '2px solid red'}} /></label>
//                <br /><br />
              
   
//      <label>
//      <h1><mark>State:</mark></h1>
//                <input name="state" type="text" style={{border: '2px solid red', backgroundcolor: 'powderblue', color: 'blue'}} /></label>
//                <br /><br />
//                <label>
//                    ZipCode: 
//                <input name="zipcode" type="text" style={{border: '2px solid red'}} /></label>
//                <br /><br />
//                <input type="submit" onClick={() => setOfficial(official + 1)} value="go" style={{border: '2px solid red'}} /> 
//            </form>           
            
//             </div>

            
//             {/*    ********************  #THIS IS THE NEW FORM !!!  **************BOB */}





//             <div className="flex-container" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', marginRight:"70%"}} >
                
//                 <form onSubmit={handleSubmit2}  >            

                
//                 <label>
//                 Street Name:
//                 <div><input name="streetnamenew" type="text" style={{border: '2px solid red'}} /> 
//                 <input name="streetname1new" type="text" style={{border: '2px solid red'}} /> 
//                 <input name="streetname2new" type="text" style={{border: '2px solid red'}} />  </div></label>
//                 <br /><br />
                
//                 <label>
//                     City:
//                 <input name="citynew" type="text" style={{border: '2px solid red'}} /></label>
//                 <br /><br />
              
   
//      <label>
//         <h1><mark>State:</mark></h1>
//                 <input name="statenew" type="text" style={{border: '2px solid red', backgroundcolor: 'powderblue', color: 'blue'}} /></label>
//                 <br /><br />
//                 <label>
//                     ZipCode: 
//                 <input name="zipcodenew" type="text" style={{border: '2px solid red'}} /></label>
//                 <br /><br />
//                 {/* <input type="submit2" value="go2" style={{border: '2px solid red'}} />  */}
//                 <button type="submit" name="btn" value="submit2" style={{border: '2px solid purple'}}>
//                     BOOYAH PANCAKES :O
//                 </button>
//             </form>
                
               


//                 {/*    ********************  THIS IS THE NEW FORM END   **************BOB */}        


//                   </div> 

//               </body>       
      

//          </div>
    

//       </div>

    
//     {/*<Footer />*/}
// </>

// )}



 
// export  async function getStaticProps (context) {
// const data = await getElections()
// const jsonstring = JSON.stringify(data);                     
// const obj = JSON.parse(jsonstring);                         
// console.log("obj: ", obj);                                
// let result =[];
// for(let i in obj)
// result.push(data[i])
// result.push(obj.elections[0].name, obj.elections[0].id, obj.elections[0].electionDay );
// console.log("JSON DATA: ", data)
// // console.log("RESULT: ", result)
// // console.log("JSON STRING: ", jsonstring)
// // console.log("ARRAY DATA: ", result)
// // console.log("DATA SNATCH: ", (obj.elections[0].name))
// return {
//     props: {data},
// }

// }




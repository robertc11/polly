import React, {useEffect} from 'react'
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

// var cardstyle = {

//     card:{
//     boxshadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
//     transition: "0.3s",
// },

// cardhover: {
//     boxshadow: "0 8px 16px 0 rgba(0,0,0,0.2)"

// },

// container: {
//     padding: "2px 16px"
// }



// }


var stylesrob = {
    base:{
        height:"900%",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    //...other styles...
};


export default  function infoSTool({data}) {
    
    const handleSubmit2 = async (e) => {
        console.log("GOT HERE")
        e.preventDefault()

        
        const body2 = {
            //address: e.currentTarget.address.value,
            streetnamenew: e.currentTarget.streetnamenew.value,
            streetname1new: e.currentTarget.streetname1new.value,
            streetname2new: e.currentTarget.streetname2new.value,
            
            citynew: e.currentTarget.citynew.value,
            statenew: e.currentTarget.statenew.value,
            zipcodenew: e.currentTarget.zipcodenew.value            

        }

        const dataResultNew = await getRepresentativeByDivision(body2.streetnamenew + '%2F'+ body2.streetname1new + '%3A'+ body2.streetname2new  + '%2F' + body2.citynew + '%3A'+ body2.statenew)
                console.log("INFO: ###GET VOTER INFO FORM2", dataResultNew)
    }   
    
    
    const handleSubmit = async (e) => {
        console.log("GOT HERE")
        e.preventDefault()
        // e.toString()
        // .toLowerCase()

        const body = {
            //address: e.currentTarget.address.value,
            streetname: e.currentTarget.streetname.value,
            streetname1: e.currentTarget.streetname1.value,
            streetname2: e.currentTarget.streetname2.value,
            
            city: e.currentTarget.city.value,
            state: e.currentTarget.state.value,
            zipcode: e.currentTarget.zipcode.value
            

        }
        //console.log("BODY", e.currentTarget.address.value);
        alert(body.address)

        const dataResult = await getVoterInfo(body.streetname + '%20'+ body.streetname1 + '%20'+ body.streetname2  + '%20' + body.city + '%20'+ body.state + '%20' + body.zipcode)    
        alert(JSON.stringify(dataResult))
        console.log("GET VOTER INFO API CALL", dataResult) //why do these console logs not work        
        const dataResult2 = await getElections () 
        console.log("GET ELECTIONS API CALL", dataResult2) //why do these console logs not work
            alert(JSON.stringify(dataResult2))
           

        const represult = await getRepresentativeByAddress (body.streetname + '%20'+ body.streetname1 + '%20'+ body.streetname2  + '%20' + body.city + '%20'+ body.state + '%20' + body.zipcode)
        var repObj = (JSON.stringify(represult))
        const repJSON = JSON.parse(repObj)
        alert(JSON.stringify(represult))
        console.log("GET REPS API CALL", repJSON) //why do these console logs not work
        console.log("one official: ", repJSON.officials[1])
        return {
            props: { repJSON },
        }
        

        }   
            


     
    
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



<Card style={{ width: '18rem', align: 'right' }}>
  <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
  </Card.Body>
  <ListGroup className="list-group-flush">
    <ListGroupItem>{(repJSON.officials[1])}</ListGroupItem>
    <ListGroupItem>More rep info can be found on the polly card</ListGroupItem>
    <ListGroupItem>This is rob trying to creare a polly card</ListGroupItem>
  </ListGroup>
  <Card.Body>
    <Card.Link href="#">Card Link</Card.Link>
    <Card.Link href="#">Another Link</Card.Link>
  </Card.Body>
</Card>


{/* <div class="cardstyle.card">
  <img src="img_avatar.png" alt="Avatar" style={{width: '100%'}}></img>
  <div class="cardstyle.container">
    <h4><b>John Doe</b></h4>
    <p>Architect & Engineer</p>
  </div>
</div>  */}


        <div className="flex-container" style={stylesrob} /*style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', marginRight:"70%"}}*/  >
           <form onSubmit={handleSubmit} >       

              
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
               <input type="submit" value="go" style={{border: '2px solid red'}} /> 
           </form>           
            
            </div>

            
            {/*    ********************  THIS IS THE NEW FORM   **************BOB */}





            <div className="flex-container" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', marginRight:"70%"}} >
                
                <form onSubmit={handleSubmit2}  >            

                
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
                
               


                {/*    ********************  THIS IS THE NEW FORM END   **************BOB */}        


                </div> 
       </body>


        
      

    </div>

    </div>

</>)}



 
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




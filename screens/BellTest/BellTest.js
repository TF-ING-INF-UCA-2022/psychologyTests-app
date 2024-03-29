import React from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { general,mainPage } from '../../config/styles/GeneralStyles';
import { timer } from '../../config/styles/BellTestStyles';
import { FontAwesome } from '@expo/vector-icons';
import BellTestInstructions from './BellTestInstructions'
import ReturnHomeComponent from '../../components/ReturnHomeComponent'
import { connect} from 'react-redux';
import Timer from '../../components/Hanoi/Timer';
import DatabaseService from '../../services/DatabaseService';
import FinishTestComponent from '../../components/returnButton';

import IconContainer from './IconContainer'
import { set } from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width-20;
const windowHeight = Dimensions.get('window').height-20-120-60;

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
    interviewer: state.userReducer.interviewer
  }
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function generateIcons(addEvent,height,width){
  console.log(windowHeight, windowWidth)
  const inconsList = ["star","book","camera", "video-camera", "gift","legal","trophy","heart","coffee"]
  var list = []
  console.log(height)
  console.log(width)
  console.log("Area: ", (windowHeight*windowWidth)/160)
  console.log("Box Area:", height*width)
  for (let index = 0; index < 150; index++) {
    const random = Math.floor(Math.random() * inconsList.length);
    list.push(<IconContainer key = {index} height={height} width={width} name={inconsList[random]} addEvent={addEvent}></IconContainer>)
  }
  for (let index = 0; index < 10; index++) {
    list.push(<IconContainer key = {154+index} height={height} width={width} name={"bell"} addEvent={addEvent}></IconContainer>)
  }
  return shuffle(list)
}

class BellTest extends React.Component {
  constructor(props){
    super(props);
    this.stopTimer = React.createRef();
    this.state = {
      bells: 0,
      mistakes: 0,
      listado: [],
      results: [],
      height: windowHeight/8,
      width: windowWidth/20,
      visibleFinished: false,
      testApproved: false,
      testBellColor: "#000000",
      startTime: new Date(),
      timerVisible: false,
      patientNumber: this.props.user,
      interviewerNumber: this.props.interviewer,
      showCross: false
    }
  }

  addEvent=(event)=>{
    if(event == "bell"){
      this.addBell()
    }
    else{
      this.addMistake()
    }
  }
  addBell = () => {
    const time =(new Date() - this.state.startTime - 3000)
    const user = this.props.user
    const interviewer = this.props.interviewer
    const results = this.state.results
    const bells = this.state.bells
    const mistakes = this.state.mistakes
    results.push({user: user, interviewer: interviewer, bells: bells+1, mistakes: mistakes, omisionMistakes:0, timeInS: (time*0.001), timeInMs: time})
    console.log("Bell")
    this.setState({bells: this.state.bells + 1,results: results})
    if(this.state.bells == 9){
      console.log(this.state.results)
      this.setState({visibleFinished: true})
      DatabaseService.instance().saveBellsTestResult(this.state.patientNumber, this.state.interviewerNumber, this.state.results).then(() => {
        console.log("guardado")
      });
    }
  }

  addMistake = () => {
    const time =(new Date() - this.state.startTime -3000)
    const user = this.props.user
    const interviewer = this.props.interviewer
    const results = this.state.results
    const bells = this.state.bells
    const mistakes = this.state.mistakes
    results.push({user: user, interviewer: interviewer, bells: bells, mistakes: mistakes+1, omisionMistakes: 0,timeInS: (time*0.001), timeInMs: time})
    this.setState({mistakes: this.state.mistakes + 1,results: results})
    this.setState({mistakes: this.state.mistakes + 1})
    console.log("Mistake")
  }
  setInvisible =()=>{
    this.setState({showCross: true});
    setTimeout(() => {this.setState({showCross: false})}, 3000);
    this.setState({listado: generateIcons(this.addEvent, this.state.height, this.state.width),timerVisible: true , startTime: new Date()})
  }

  finishTest = () => {
    const time =(new Date() - this.state.startTime -3000)
    const user = this.props.user
    const interviewer = this.props.interviewer
    const results = this.state.results
    const bells = this.state.bells
    const mistakes = this.state.mistakes
    results.push({user: user, interviewer: interviewer, bells: bells, mistakes: mistakes, omisionMistakes: 10-bells , timeInS: (time*0.001), timeInMs: time})
    this.setState({visibleFinished: true})
    DatabaseService.instance().saveBellsTestResult(this.state.patientNumber, this.state.interviewerNumber, this.state.results).then(() => {
      console.log("guardado")
    });
  }

    render(){
    return (
      <>
      <BellTestInstructions navigation={this.props.navigation} callback={() => this.setInvisible()}></BellTestInstructions>
      {!this.state.showCross?
      <>
      <Modal animationType="slide" visible={this.state.visibleFinished}>
        <ReturnHomeComponent navigation={this.props.navigation}/>
      </Modal>
      <View style={{flex:1, flexDirection: "column"}}>
        <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
          <View style={timer}>
            {this.state.timerVisible? <Timer ref={this.stopTimer}/>: null}
          </View>
          {this.state.timerVisible? <FinishTestComponent onPress={this.finishTest}/>: null}
        </View>
        <View style={{flex:1, flexDirection: "row",margin:10, flexWrap:"wrap",alignItems: "center",justifyContent: "center"}}>
            {this.state.listado}
        </View>
      </View>
      </>
      :
      <View style={{width: '100%', height: '100%', backgroundColor: 'black', padding: 32, alignItems: 'center', justifyContent: 'space-evenly'}}>
        <Text style={{fontSize: 160, color: 'white'}}>✕</Text>
      </View>} 
      </>
      );
  }
};
export default connect(mapStateToProps)(BellTest);
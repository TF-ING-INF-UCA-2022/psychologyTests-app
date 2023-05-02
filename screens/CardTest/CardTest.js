import React from 'react';
import {
  View,
  Animated,
  PanResponder,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';

import { CardsConfig, instructions } from '../../config/styles/CardTestStyles';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import CardContainer from './CardContainer';
import { general, mainPage } from '../../config/styles/GeneralStyles';
import CardTutorial from './cardTutorial';
import colors from '../../config/colors';
import ReturnHomeComponent from '../../components/ReturnHomeComponent';
import { connect} from 'react-redux';

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
    interviewer: state.userReducer.interviewer
  }
}

function generateCards(){
    const iconsList=['rabbit','ship']
    const colors =["#a95906","#ffffff"]
    const cards=[]
    for (let index = 0; index < 10; index++) {
        const random = Math.floor(Math.random() * iconsList.length);
        const color = colors[Math.floor(Math.random() * 2)]
        cards.push({id:index, name: iconsList[random], color: color})
        //cards.push(<CardContainer key = {index} name={iconsList[random]} color={color}></CardContainer>)
      }
    return cards
}

class CardTest extends React.Component {
    state={
        rabbitColor: "#a95906",
        shipColor: "#ffffff",
        evaluation: ['color','shape'][Math.floor(Math.random() * 2)],
        cards: [],
        visible: true,
        mistakes:0,
        catches:0,
        responseModalVisible: false,
        idToDelete: 0,
        lastEvent: "",
        totalEvents:0,
        finishedTutorial:false,
        finishedGameModalVisible: false,
        roundResults: [],
        catchPersistence: 0,
        mistakePersistence: 0,
        startTime: new Date().getTime(),
        finishTime: "",
        totalTime: "",
        patientNumber: this.props.user,
        interviewerNumber: this.props.interviewer,
    }

    addEvent=(id,name,color,side)=>{
        if(this.state.evaluation == "color"){
            if(side =="rabbit"){
                this.state.rabbitColor == color ? this.addCatch() : this.addMistake()
            }
            else{
                this.state.shipColor == color ? this.addCatch() : this.addMistake()
            }
        }
        else{
            name == side ? this.addCatch() : this.addMistake()
        }
        this.setState({responseModalVisible: true, idToDelete: id, totalEvents: this.state.totalEvents+1}) 
    }
    addCatch = () => {
        var catchPersistence = this.state.catchPersistence
        var results = this.state.roundResults
        var criterio = this.state.evaluation
        if(this.state.lastEvent == "catch") {
            catchPersistence = catchPersistence + 1
        }
        results.push({user: this.props.user, interviewer: this.props.interviewer ,criterio: criterio, catchPersistence: catchPersistence, mistakePersistence: 0, round: this.state.totalEvents+1, event: "catch"})
        this.setState({catches: this.state.catches + 1, lastEvent: "catch", roundResults: results, catchPersistence: catchPersistence, mistakePersistence: 0})
    }
    
    addMistake = () => {
        var mistakePersistence = this.state.mistakePersistence
        var results = this.state.roundResults
        var criterio = this.state.evaluation
        if(this.state.lastEvent == "mistake") {
            mistakePersistence = mistakePersistence + 1
        }
        results.push({user: this.state.patientNumber, interviewer: this.state.interviewerNumber ,criterio: criterio, catchPersistence: 0, mistakePersistence: mistakePersistence, round: this.state.totalEvents+1, event: "mistake"})
        this.setState({mistakes: this.state.mistakes + 1, lastEvent: "mistake", roundResults: results, catchPersistence: 0, mistakePersistence: mistakePersistence})
    }

    setInvisible =()=>{
        this.setState({visible: false, cards: generateCards()})
    }

    finishTutorial = () =>{
        this.setState({finishedTutorial: true})
    }

    setResponseModalInvisible =()=>{
        var result = this.state.cards.filter( item=> item.id != this.state.idToDelete);
        const color = ["#a95906","#ffffff"][Math.floor(Math.random() * 2)]
        var anotherColor =""
        if(color == "#a95906"){
            anotherColor = "#ffffff"
        }
        else{
            anotherColor = "#a95906"
        }
        this.setState({cards: result, rabbitColor: color, shipColor: anotherColor, responseModalVisible: false});
        if(this.state.totalEvents==10){
            var starTime = this.state.startTime
            var finishTime = new Date().getTime()
            this.setState({finishedGameModalVisible: true, finishTime: finishTime, totalTime: finishTime - starTime})
            console.log("terminado")
            console.log(this.state.roundResults)
            console.log(this.state.startTime)
            console.log(this.state.finishTime)
            console.log(this.state.totalTime)
        }
    }

    render(){
        const listado = this.state.cards.map( (item) => <CardContainer key={item.id} id={item.id} name={item.name} color={item.color} addEvent={this.addEvent}/> );
        return (
        <>
        <Modal animationType="slide" visible={this.state.finishedGameModalVisible}>
          <ReturnHomeComponent navigation={this.props.navigation}/>
        </Modal>
        {!this.state.finishedTutorial ?<CardTutorial finishTutorial={this.finishTutorial}></CardTutorial>:<>
        <Modal transparent="true" animationType="slide" visible={this.state.visible}>
            <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center',backgroundColor:"#F6F3F5"}}>
                <Text style={instructions.text}>criterio : {this.state.evaluation}</Text>
                <TouchableOpacity style={mainPage.button} onPress={this.setInvisible}>
                    <Text style={instructions.buttonText}> Comenzar test</Text>
                </TouchableOpacity>
            </View>
        </Modal>
        <Modal transparent="true" visible={this.state.responseModalVisible}>
            <View style={instructions.popupModalContainer}>
                {this.state.lastEvent == "catch" ?
                    <View style ={instructions.popupModalCorrectContainer}>
                        <Text style={[instructions.buttonText,{alignSelf:"center"}]}>Jugada completada {this.state.lastEvent}</Text>
                        <View style={{alignSelf:"center"}}>
                            <FontAwesome name="check-circle" size={50} color={colors.homeButton} />
                        </View>
                        <View style={instructions.buttonModalContainer}>
                            <TouchableOpacity style={[instructions.emptyButton,{alignSelf:"center"}]} onPress={this.setResponseModalInvisible}>
                                <Text style={instructions.emptyButtonText}> Siguiente carta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View style ={instructions.popupModalIncorrectContainer}>
                        <Text style={[instructions.buttonText,{alignSelf:"center"}]}>Jugada completada {this.state.lastEvent}</Text>
                        <View style={{alignSelf:"center"}}>
                            <FontAwesome name="times-circle" size={50} color={colors.danger} />
                        </View>
                        <View style={[instructions.buttonModalContainer,{flexDirection:'row'}]}>
                            <TouchableOpacity style={[instructions.emptyDangerButton,{alignSelf:"center"}]} onPress={this.setResponseModalInvisible}>
                                <Text style={instructions.emptyDangerButtonText}>Siguiente carta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        </Modal>
        <View style={CardsConfig.container}>
            {listado[0]}
            <View style={CardsConfig.optionsContainer}>
                <View style={CardsConfig.box}>
                    <MaterialCommunityIcons style={{alignSelf: "center"}} name="rabbit" size={150} color={this.state.rabbitColor} />
                </View>
                <View style={CardsConfig.box}>
                    <Fontisto style={{alignSelf: "center"}}name="ship" size={120} color={this.state.shipColor} />
                </View>
            </View>
        </View>
        </>}
        </>
        );
    }
};
export default connect(mapStateToProps)(CardTest);
import React from 'react';
import {
  View,
  Animated,
  PanResponder,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';

import { CardsConfig } from '../../config/styles/CardTestStyles';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import CardContainer from './CardContainer';
import { general, mainPage } from '../../config/styles/GeneralStyles';

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

export default class CardTest extends React.Component {
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
    }

    addEvent=(id,name,color,side)=>{
        /*if(event == "catch"){
          this.addCatch()
        }
        else{
          this.addMistake()
        }*/
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
        if(this.state.totalEvents == 10){
            console.log("terminado")
            console.log(this.state.catches)
            console.log(this.state.mistakes)
        }
        
    }
    addCatch = () => {
        this.setState({catches: this.state.catches + 1, lastEvent: "catch"})
    }
    
    addMistake = () => {
        this.setState({mistakes: this.state.mistakes + 1,lastEvent: "mistake"})
    }

    setInvisible =()=>{
        this.setState({visible: false, cards: generateCards()})
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
    }

    render(){
        const listado = this.state.cards.map( (item) => <CardContainer key={item.id} id={item.id} name={item.name} color={item.color} addEvent={this.addEvent}/> );
        return (
        <>
        <Modal transparent="true" animationType="slide" visible={this.state.visible}>
          <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center',backgroundColor:"#F6F3F5"}}>
          <Text style={general.textStyle}>criterio : {this.state.evaluation}</Text>
            <TouchableOpacity style={mainPage.button} onPress={this.setInvisible}>
              <Text style={general.textStyle}> Comenzar test</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal transparent="true" visible={this.state.responseModalVisible}>
            <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
                {this.state.lastEvent == "catch" ?
                    <View style ={{backgroundColor: "#b5d7c4", opacity:0.7, width:500, height:200, borderRadius:15}}>
                        <Text style={[general.textStyle,{alignSelf:"center"}]}>Jugada completada {this.state.lastEvent}</Text>
                        <View style={{alignSelf:"center"}}>
                            <FontAwesome name="check-circle" size={50} color="#4b9b7f" />
                        </View>
                        <TouchableOpacity style={[mainPage.button,{alignSelf:"center"}]} onPress={this.setResponseModalInvisible}>
                            <Text style={general.textStyle}> Siguiente carta</Text>
                        </TouchableOpacity>
                    </View>:
                    <View style ={{backgroundColor: "#dab89d", opacity:0.7, width:500, height:200, borderRadius:15}}>
                    <Text style={[general.textStyle,{alignSelf:"center"}]}>Jugada completada {this.state.lastEvent}</Text>
                    <View style={{alignSelf:"center"}}>
                        <FontAwesome name="times-circle" size={50} color="#e04d44" />
                    </View>
                    <TouchableOpacity style={[mainPage.button,{alignSelf:"center"}]} onPress={this.setResponseModalInvisible}>
                        <Text style={general.textStyle}> Siguiente carta</Text>
                    </TouchableOpacity>
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
                    <Fontisto style={{alignSelf: "center"}}name="ship" size={130} color={this.state.shipColor} />
                </View>
            </View>
        </View>
        </>
        );
    }
};
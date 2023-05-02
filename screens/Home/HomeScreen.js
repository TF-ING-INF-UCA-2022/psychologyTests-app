import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Image,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { FontAwesome, MaterialCommunityIcons,Ionicons  } from '@expo/vector-icons';

import colors from '../../config/colors';
import { general, mainPage } from '../../config/styles/GeneralStyles';
import AppButton from '../../components/AppButton';
import TestsNames from '../../Helpers/TestsNames';
import { connect} from 'react-redux';
import { setUser,setInterviewer } from '../../redux/actions/user';
import { ScrollView } from 'react-native';

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
    interviewer: state.userReducer.interviewer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (data) => dispatch(setUser(data)),
    setInterviewer: (data) => dispatch(setInterviewer(data))
  }
}

class HomeScreen extends React.Component{
  state ={
    selectedTest: null,
    modalVisible: false,
    patientNumber: this.props.user,
    interviewerNumber: this.props.interviewer,
    patientError: null,
    interviewerError: null,
  }

  selectTest=(testName)=>{
    var patientNumber = this.state.patientNumber;
    this.props.navigation.navigate(testName, {patientNumber});
    //this.navigation.navigate(testName);
  }
  /*cancel=()=>{
    setPatientNumber(null);
    setInterviewerNumber(null);
  }*/

  /*openTest=()=>{
    if (!patientNumber) {
      setPatientError('Por favor ingresa un número de paciente.');
      return;
    }
    if (!intrviewerNumber) {
      setInterviewerError('Por favor ingresa un número de entrevistador.');
      return;
    }
    /*setModalVisible(!modalVisible);
    navigation.navigate(selectedTest, {patientNumber});*/
  //}
  //}
  render(){
    return (
      <SafeAreaView>
        <View style={{ position: 'absolute', right: 100, justifyContent:"flex-end", height:160, width: 230} }>
          <Image style={styles.logo} source={require('../../assets/logoUca.png')}/> 
        </View>
        <ScrollView>
          <View style={styles.identificationsContainer}>
            <Text style={styles.identificationsTitle}>Ingrese número de profesional y paciente</Text>
            <View style={styles.imageAndIdContainer}>
              <Ionicons name="person" size={30} color="black" />
              <TextInput
                style={styles.patientModal.input}
                value={this.state.interviewerNumber}
                onChangeText={(interviewerNumber) => this.setState({ interviewerNumber })}
                placeholder='Número de profesional'
                keyboardType='numeric'
                //disabled = 'true'
              ></TextInput>
              <Text>{this.state.patientError}</Text>
              <MaterialCommunityIcons name="pencil" size={25} color="black" />
            </View>
            <View style={styles.imageAndIdContainer}>
              <FontAwesome name="image" size={30} color="black"/>
              <TextInput
                style={styles.patientModal.input}
                value={this.state.patientNumber}
                onChangeText={(patientNumber) => this.setState({ patientNumber })}
                placeholder='Número de paciente'
                keyboardType='numeric'
                //disabled = 'true'
              ></TextInput>
              <Text>{this.state.interviewerError}</Text>
              <MaterialCommunityIcons name="pencil" size={25} color="black" />
            </View>
            <AppButton title={'Guardar'} color={colors.button} textColor={colors.white} style={styles.patientModal.button} onPress={()=>
              {this.props.setUser(this.state.patientNumber)
              this.props.setInterviewer(this.state.interviewerNumber)}}></AppButton>
          </View>
          <View style={styles.header}>
            <View style={{flex: 1, marginLeft: 80}}>
              <Text style={styles.headerText}>Seleccione una prueba para comenzar</Text>
            </View>
          </View>
          <View style={styles.itemsContainer}>
            <TouchableOpacity style={[mainPage.button,{flexDirection:"row"}]}  onPress={() => this.selectTest('pyramidAndPalmTreesTest')} delayPressIn={0}>
              <MaterialCommunityIcons name="pyramid" size={35} color={colors.white}/>
              <Text style={general.textStyle}>{TestsNames.pyramidAndPalmTreesTest}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[mainPage.button,{flexDirection:"row"}]} onPress={() => this.selectTest('bellTest')} delayPressIn={0}>
              <FontAwesome name="bell-o" size={35} color={colors.white}/>
              <Text style={general.textStyle}>{TestsNames.bellTest}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[mainPage.button,{flexDirection:"row"}]} onPress={() => this.selectTest('hanoiTest')} delayPressIn={0}>
              <FontAwesome name="image" size={35} color={colors.white}/>
              <Text style={general.textStyle}>{TestsNames.hanoiTest}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[mainPage.button,{flexDirection:"row"}]} onPress={() => this.selectTest('corsiTest')} delayPressIn={0}>
              <FontAwesome name="cube" size={35} color={colors.white}/>
              <Text style={general.textStyle}>{TestsNames.corsiTest}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[mainPage.button,{flexDirection:"row"}]} onPress={() => this.selectTest('cardTest')} delayPressIn={0}>
            <MaterialCommunityIcons name="cards" size={35} color={colors.white}/>
              <Text style={general.textStyle}>{TestsNames.cardTest}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[mainPage.button,{flexDirection:"row"}]} onPress={() => this.selectTest('colorTrailsTest')} delayPressIn={0}>
              <FontAwesome name="image" size={35} color={colors.white}/>
              <Text style={general.textStyle}>{TestsNames.colorTrailsTest}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
  
      </SafeAreaView>
      );
  }

}
  
  const styles = StyleSheet.create({
    patientModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      modalView: {
        width: 500,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      title: {
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      input: {
        width: '100%',
        fontSize: 16,
        padding: 10,
        borderBottomWidth: 1,
        minWidth: 250,
        borderColor: 'grey',
        marginBottom: 10,
      },
      buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:"space-evenly",
        marginTop: 10,
        marginBottom: 10,
        width:150
      },
      button: {
        marginTop: 20,
        marginRight: 'auto',
        width: 150,
      }
    },
    identificationsContainer:{
      width: 550, 
      backgroundColor:"white",
      marginLeft:75,
      borderRadius:15,
      flexDirection:"column",
      alignItems:"center",
      paddingVertical: 30,
      paddingHorizontal: 40,
      marginTop: 40
    },
    identificationsTitle: {
      color: colors.title,
      alignSelf: 'flex-start',
      marginBottom: 20,
      fontSize: 16
    },
    imageAndIdContainer:{
      display:'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      flexDirection:"row",
      width: '80%',
    },
    itemsContainer: {
      margin: 50,
      marginTop:10,
      flex:1,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: 'row',
      flexWrap: "wrap",
    },
    header:{
      alignItems: 'center',
      flexDirection: "row",
      width: "100%",
    },
    logo: {
      flex: 1,
      borderBottomStartRadius: 15,
      borderBottomEndRadius: 15,
      width: 230,
      height: 160
    },
    headerItem: {
      flex: 1,
    },
    headerText: {
      color: colors.title,
      marginTop: 50,
      marginBottom: 10,
      fontSize: 30,
      fontWeight: 'bold'
    }
  });

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

import { Ionicons } from "@expo/vector-icons";
import { Text,TextInput,View,StyleSheet } from "react-native";
import { GlobalColors } from "../../constants/colors";
function Input({
    keyboardType,
    placeholder,
    icon,
    secure,
    onChangeText,
    value,
    isInvalid
})
{
    return(
    <View style={[styles.inputContainer, isInvalid && styles.inputInvalid]}>
      {/* <Text style={[styles.label]}>
        {label}
      </Text> */}
      
        <Ionicons size={20} name={icon} style={styles.icon} color={GlobalColors.colors.pink10}/>

      <TextInput
        style={[styles.input]}
        autoCapitalize="none"
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={GlobalColors.colors.pink10}
        secureTextEntry={secure}
        onChangeText={onChangeText}
        defaultValue={value}
      />  
    </View>)
}
export default Input;
const styles = StyleSheet.create({
    inputContainer: {
      flex:1,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      borderRadius:25,
      backgroundColor:GlobalColors.colors.pink1,
      height:50,
      borderWidth:2,
      marginHorizontal:20,
      marginVertical:8,
      borderColor:GlobalColors.colors.pink10,
      
    
    },
    
    input: {
      flex:1,
      paddingLeft:5,
      paddingVertical:0,
      color:GlobalColors.colors.pink10,
      fontWeight:'bold'
    },
    inputInvalid: {
      borderColor: 'red',
      color:'red'
    },
    icon:{
        paddingLeft:10,
        paddingRight:5
    }
    
  });
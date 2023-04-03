import { Button } from 'react-native-paper'
import {  GlobalColors } from "../../constants/colors";
import { StyleSheet } from 'react-native';
function ButtonCustom({children,onPress,color})
{
    return(
    <Button style={styles.button} mode='elevated' buttonColor={color} textColor= 'white' onPress={onPress}>{children}</Button>
    )
}
export default ButtonCustom;
const styles = StyleSheet.create((
    {
        button:{
            marginBottom:10,
            marginTop:10,
            fontWeight:'bold'
        }
        
    }
))


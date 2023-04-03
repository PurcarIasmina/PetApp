import {View,TouchableOpacity,StyleSheet,Text} from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { GlobalColors } from '../../constants/colors';
import { useFonts } from 'expo-font';
function IconButton({icon,size,color,label,onPress,top,text,left})
{

    const [fonts] = useFonts(
        {
            'Lora': require('../../constants/fonts/Lora-VariableFont_wght.ttf'),
            'Garet-Book': require('../../constants/fonts/Garet-Book.ttf')
        }
    )
    return(
        <View style={[styles.iconContainer]}>
            <View style={{top:top,marginLeft:left}}>
                <TouchableOpacity onPress={onPress}>
                    <Ionicons style={styles.icon} name={icon} size={size} color={color}/>
                </TouchableOpacity>
            </View>
            <Text style={[styles.label,{paddingTop:top}]}>{label}</Text>
        </View>
    )
}
export default IconButton;
const styles = StyleSheet.create(
    {
        iconContainer:{
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
            
        },
        
        icon:{
            paddingBottom:10,
    
            
        },
        label:{
            fontFamily:'Garet-Book',
            fontWeight:'bold',
            color:GlobalColors.colors.darkGrey,
            paddingTop:2,
            paddingRight:2,
            paddingLeft:4,
            marginHorizontal:2

        },
    }
)
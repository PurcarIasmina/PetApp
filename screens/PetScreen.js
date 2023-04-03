import { useLayoutEffect } from "react";
import PetCard from "../components/PetCard/PetCard";
import { useRoute } from "@react-navigation/native";
function PetScreen({ navigation }) {
  const route = useRoute();
  console.log(route.params);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
    }),
      [navigation];
  });
  return (
    <PetCard
      name={route.params.name}
      breed={route.params.breed}
      datebirth={route.params.datebirth}
      owner={route.params.owner}
      color={route.params.color}
      gender={route.params.gender}
      photo={route.params.photo}
      aid={route.params.aid}
      generatedId={route.params.generatedId}
    />
  );
}
export default PetScreen;

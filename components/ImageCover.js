import React from "react";
import { StyleSheet, View } from "react-native";
import { BackgroundCarousel } from "./BackgroundCarousel";

const images = [
  "https://www.hostyapp.com/wp-content/uploads/2017/06/Airbnb-Photography-1030x687.jpg",
  "https://thewanderingwanderluster.com/wp-content/uploads/Moo-Apartments.jpg",
  "https://cdn.vietnammoi.vn/stores/news_dataimages/huongttc/052018/09/18/1339_treeeeee.jpg",
  "https://i1.wp.com/www.planete-deco.fr/wp-content/uploads/2018/06/LO0-1.jpg?w=1292&ssl=1",
  "https://ruralka.com/packages/syscover/hotels/storage/attachment/159/es/ruralka-hoteles-mar-de-la-carrasca-castellon-habitacion-doble.jpg"
];

const ImageCover = () => {
  return (
    <View style={styles.container}>
      <BackgroundCarousel images={images}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    position: "relative"
  }
});

export default ImageCover;

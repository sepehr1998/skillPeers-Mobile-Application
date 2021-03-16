import React, { Component } from "react";
import { View, StyleSheet, Text, Image, Linking } from "react-native";
import { Icon } from "react-native-elements";
import { userLogined } from "../redux/actions/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Color from "../constants/color.js";
import { ScrollView } from "react-native";

class AboutUs extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ alignItems: "center", marginHorizontal: 30 }}>
            <Image
              style={styles.productImg}
              source={require("../assets/icon-png.png")}
            />
            <Text style={styles.name}>Proslinks</Text>
            <Text style={styles.price}></Text>
            <Text style={styles.description}>
              We are here to help you sell/buy skills
            </Text>
          </View>

          <View style={styles.contentSize}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Icon
                style={{ marginRight: 5 }}
                name="map-marker"
                type="font-awesome"
                size={24}
                onPress={() => this.notifyMessage("Under Construction")}
                color={Color.primaryBackground}
              />
              <Text style={{ fontSize: 16, marginTop: 4 }}>
                Aliso Viejo, California
              </Text>
            </View>

            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 20 }}
            >
              <Icon
                style={{ marginRight: 5 }}
                name="envelope"
                type="font-awesome"
                size={20}
                onPress={() => this.notifyMessage("Under Construction")}
                color={Color.primaryBackground}
              />
              <Text style={{ fontSize: 16 }}>info@proslinks.com</Text>
            </View>

            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 20 }}
            >
              <Icon
                style={{ marginRight: 5 }}
                name="globe"
                type="font-awesome"
                size={20}
                onPress={() => this.notifyMessage("Under Construction")}
                color={Color.primaryBackground}
              />

              <Text
                style={{ color: "#0645AD", fontSize: 16 }}
                onPress={() => Linking.openURL("http://proslinks.com")}
              >
                www.proslinks.com
              </Text>

              <Text style={{ fontSize: 16 }}></Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottom}>
          <View style={styles.separator}></View>
          <Text style={{ textAlign: "center", color: "#a6a9b6" }}>
            © 2021 ProsLinks, LLC.
          </Text>
        </View>
      </View>
    );
  }
}

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  productImg: {
    width: 150,
    height: 150,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "bold",
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    marginTop: 10,
    color: "#696969",
  },
  btnColor: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginHorizontal: 3,
  },
  btnSize: {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderColor: "#778899",
    borderWidth: 1,
    marginHorizontal: 3,
    backgroundColor: "white",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  contentColors: {
    justifyContent: "center",
    marginHorizontal: 30,
    flexDirection: "row",
    marginTop: 20,
  },
  contentSize: {
    justifyContent: "center",
    marginHorizontal: 30,
    alignItems: "center",
    flexDirection: "column",
    marginTop: 20,
  },
  separator: {
    height: 2,
    backgroundColor: "#eeeeee",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 30,
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  addToCarContainer: {
    marginHorizontal: 30,
  },
  bottom: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
});

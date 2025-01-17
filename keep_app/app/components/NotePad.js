import {
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  BackHandler,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  IconButton,
  HStack,
  Button,
  Avatar,
  Icon,
  TextInput,
} from "@react-native-material/core";
import { useSelector, useDispatch } from "react-redux";
import {
  addNote, 
  updateNote, 
  deleteNote,
} from "../store/slices";
import randomId from "../store/generator";

const initialState = { title: "", description: "", color: "", id: "" };
const NotePad = ({ route, navigation }) => {
  const { noteId } = route.params;
  const [id, setId] = useState(noteId ?? null);
 
  const notesRecord = useSelector((state) => state.notes["data"]);

  const [data, setData] = useState(initialState);
  const [oldData, setOldData] = useState(data);
  const dispatch = useDispatch();
 
  useEffect(() => {
    // get data when note is old
    notesRecord.forEach((e) => { 
      if (e.id == noteId) {
        setData(e);
        // setOldData(e);
        return;
      }
    });
  }, []);

  const sendData = async () => {
    if (id == null && (data.title != "" || data.description != "")) {
      let newId = await randomId();
      setId(newId); 
      dispatch(addNote({ ...data, id: newId }));
      console.log("send");
    } 
    else { 
      if (data.title == "" && data.description == "") {  
        dispatch(deleteNote(id));
      }
      else{
        dispatch(updateNote({ ...data, id }));
        console.log("update");
      }
    }
  };

  useEffect(() => {
    const keybord = Keyboard.addListener("keyboardDidHide", async () => {
      await sendData();
    });
    return () => {
      keybord.remove();
    };
  }, [data]);

  useEffect(() => {
    const back = navigation.addListener("beforeRemove", async (e) => {
      console.log("back");
      await sendData();
    });
    return back;
  }, [navigation, data]);

  const handleBlur = async () => {
    // focusOut in TextInput
    await sendData() 
  };
 
  const onTouchStart = (e) => {  
    // console.log(e.target);
  }


  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#fff" }}>
        <ScrollView onTouchStart={onTouchStart} keyboardShouldPersistTaps='always' maintainVisibleContentPosition={true} style={{backgroundColor: '#fff', padding: 10, minHeight: '100%' }}>

          <TextInput
            variant="text"
            value={data.title} 
            onBlur={handleBlur}
            onChangeText={(e) => setData({ ...data, title: e })}
            placeholder="Title"
            multiline
            inputStyle={styles.textTitle}
            keyboardType="url"
            style={{
              // borderWidth: 2,
              minHeight: 16
            }}
            onContentSizeChange={(e) => {
              console.log(e);
            }}
          />

          <TextInput
            variant="text"
            value={data.description} 
            onBlur={handleBlur}
            onChangeText={(e) => setData({ ...data, description: e })}
            placeholder="Note"
            multiline
            inputStyle={styles.textNote}
          />

        </ScrollView>
      </SafeAreaView>
      <AppBar
        variant="bottom"
        leading={(props) => (
          <View>
            <IconButton
              icon={(props) => (
                <Image
                  {...props}
                  style={{ width: 30, height: 30 }}
                  source={require("../../assets/img/box_plus.png")}
                />
              )}
            />
          </View>
        )}
        trailing={(props) => (
          <View>
            <IconButton
              icon={(props) => (
                <Image
                  {...props}
                  style={{ width: 30, height: 30 }}
                  source={require("../../assets/img/blk_dots.png")}
                />
              )}
            />
          </View>
        )}
        style={styles.appBar}
      />
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "#fff",
    position: "absolute",
    start: 0,
    bottom: 0,
    end: 0,
  },
  textNote: {
    fontFamily: "My_Font",
    // marginTop: 15,
    fontSize: 18
  },
  textTitle: {
    fontSize: 19,
    fontFamily: "My_Font",
    // marginTop: 15, 
    // borderWidth: 2, 
  },
});

export default NotePad;

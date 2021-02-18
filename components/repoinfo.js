import React, { Component } from 'react';
import { Container, Content, Header, Left, Right, Body, Title, Text, Button, List, ListItem, Icon} from 'native-base';
import {connect} from 'react-redux';

import { Actions } from 'react-native-router-flux';

class RepoInfo extends Component{
  render(){
    return(
      <Container>
          <Header>
              <Left>
              <Button transparent onPress= {()=>Actions.pop()}>
                            <Icon name='arrow-back' />
                        </Button>
              </Left>
              <Body>
                  <Title>Repo Info</Title>
              </Body>
              <Right />
              </Header>
              <Content>
              {/* <List>
              <ListItem><Text>{this.props.currentUser.full_name}</Text></ListItem>
              <ListItem><Text>{this.props.currentUser.description}</Text></ListItem>
              <ListItem><Text>{this.props.currentUser.id}</Text></ListItem>
              <ListItem><Text>{this.props.currentUser.owner.login}</Text></ListItem>
              <ListItem><Text>{this.props.currentUser.url}</Text></ListItem>
              </List> */}
              <Text>Detail :{this.props.currentUser.firstName}</Text>
              </Content>
      </Container>
    );
  }
}
function mapStateToProps(state){
  return{
    currentUser : state.currentUser
  };
}
export default connect(mapStateToProps)(RepoInfo);

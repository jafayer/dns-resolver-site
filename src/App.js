import './App.css';
import React, { Component } from 'react';
import { getCurrentPath, parse, queryGoogleDNSResolver, filters } from  './resolver';

class App extends Component {
  state = { result: null, } 
  render() { 
    return (
      <div>
        <h1>DNS Resolver</h1>
        <div className="container">
        {this.state.result && this.state.result.map((item, index) => this.converter(item, index))}
        </div>
        
      </div>
    );
  }

  componentDidMount() {
    let path = getCurrentPath();
    let { address, type } = parse(path);
    let rawType = path.split(':')[0];
    queryGoogleDNSResolver(address, type, (json) => {
      if(json['Status'] === 0){
        let result = json['Answer'].map(item => item['data']);
        if(rawType in filters) {
          result = filters[rawType](result);
        }
        if(result) {
          this.setState({ result });
        };
      }
    });
  }

  converter = (item, index) => {
    let {address, type} = parse(getCurrentPath());
    console.log(address, type);
    return (
      <div key={index} className="card">
        <h2>{address}</h2>
        <p className="type">Record type: {type}</p>
        <p className="record">{item}</p>
      </div>
    );
  }
}
 
export default App;
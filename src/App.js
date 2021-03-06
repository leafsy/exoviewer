import React, { Component } from 'react';
import Papa from 'papaparse';
import View from './View';
import Table from './Table';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    Papa.parse(require('./catalog.csv'), {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: result => this.updateData(result.data),
    });
    Papa.parse(require('./solar.csv'), {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: result => this.updateData(result.data),
    });
  }

  updateData(raw) {
    const size = this.state.data.length;
    let data = raw
    .filter(p => {
      return p.planet_status === "Confirmed" &&
        p.orbital_period && p.semi_major_axis && p.star_name;
    })
    .map((p, i) => ({
      indx: i + size,
      name: p["# name"].trim(),
      mass: p.mass,
      radi: p.radius,
      perd: p.orbital_period,
      dist: p.semi_major_axis,
      ecct: p.eccentricity,
      type: p.detection_type,
      year: p.discovered,
      star: p.star_name.trim(),
      selected: true,
    }));
    this.setState({ data: [...this.state.data, ...data] });
  }

  handleSelectionChange(s) {
    const newData = [...this.state.data];
    s.selections.forEach(i => {
      newData[i].selected = s.selected;
    });
    this.setState({ data: newData });
  }

  render() {
    return (
      <div className="App">
        <View
          data={this.state.data}
        />
        <Table
          data={this.state.data}
          selectionChangeListener={s => this.handleSelectionChange(s)}
        />
      </div>
    );
  }
}

export default App;

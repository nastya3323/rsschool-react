import './Spinner.css';
import { Component, type JSX } from 'react';

const CLASS = 'spinner';

export default class Spinner extends Component {
  render(): JSX.Element {
    return <div className={CLASS}></div>;
  }
}

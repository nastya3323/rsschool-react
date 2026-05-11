import styles from './Spinner.module.css';
import { Component, type JSX } from 'react';

export default class Spinner extends Component {
  render(): JSX.Element {
    return <div className={styles.spinner}></div>;
  }
}

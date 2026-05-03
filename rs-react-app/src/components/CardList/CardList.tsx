import './CardList.css';
import { Component, type JSX } from 'react';
import Card from '../Card/Card';

const CLASSES = {
  RESULTS_TITLE: 'results__title',
  RESULTS_LIST: 'results__list',
};

interface CardItem {
  name: string;
  description: string;
}

interface CardListProps {
  results: CardItem[];
}

export default class CardList extends Component<CardListProps> {
  render(): JSX.Element {
    const { results } = this.props;

    return (
      <>
        <h2 className={CLASSES.RESULTS_TITLE}>Results {results.length}</h2>
        <div className={CLASSES.RESULTS_LIST}>
          {results.map((result, index) => {
            return <Card key={index} name={result.name} description={result.description} />;
          })}
        </div>
      </>
    );
  }
}

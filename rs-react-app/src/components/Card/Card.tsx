import './Card.css';
import { Component, type JSX } from 'react';

const CLASSES = {
  CARD_ITEM: 'card-item',
  CARD_ITEM_TITLE: 'card-item__title',
  CARD_ITEM_DESCRIPTION: 'card-item__description',
};

interface CardProps {
  name: string;
  description: string;
}

export default class Card extends Component<CardProps> {
  render(): JSX.Element {
    const { name, description } = this.props;

    return (
      <div className={CLASSES.CARD_ITEM}>
        <h3 className={CLASSES.CARD_ITEM_TITLE}>
          <span>Name</span>: {name}
        </h3>
        <p className={CLASSES.CARD_ITEM_DESCRIPTION}>
          <span>Description</span>: {description}
        </p>
      </div>
    );
  }
}

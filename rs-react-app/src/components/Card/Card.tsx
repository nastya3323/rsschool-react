import './Card.css';
import type { Character } from '../../App';
import { Component, type JSX } from 'react';

const CLASSES = {
  CARD_ITEM: 'card-item',
  CARD_ITEM_TITLE: 'card-item__title',
  CARD_ITEM_DESCRIPTION: 'card-item__description',
};

interface CardProps {
  character: Character;
}

export default class Card extends Component<CardProps> {
  render(): JSX.Element {
    const { character } = this.props;

    return (
      <div className={CLASSES.CARD_ITEM}>
        <h3 className={CLASSES.CARD_ITEM_TITLE}>
          <span>Name</span>: {character.name}
        </h3>
        <p className={CLASSES.CARD_ITEM_DESCRIPTION}>
          <span>Status</span>: {character.status}
        </p>
        <p className={CLASSES.CARD_ITEM_DESCRIPTION}>
          <span>Gender</span>: {character.gender}
        </p>
        <p className={CLASSES.CARD_ITEM_DESCRIPTION}>
          <span>Species</span>: {character.species}
        </p>
        <p className={CLASSES.CARD_ITEM_DESCRIPTION}>
          <span>Location</span>: {character.location.name}
        </p>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { Button, Nav, NavLink, Tab, Row, Col, Container, Modal, Card } from 'react-bootstrap';
import './css/home.css';
import ReactDice from 'react-dice-complete';
import 'react-dice-complete/dist/react-dice-complete.css'

const cards_list = require('./cards.json');
const players = ["RED", "BLUE", "GREEN", "YELLOW"];

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: cards_list.cards,
            show_card_detaild_flag: false,
            selected_card: null,
            totalPlayers: 4,
            playerPositions: {"RED": 0, "BLUE": 0, "GREEN": 0, "YELLOW": 0},
            playerBalance: {"RED": 1500, "BLUE": 1500, "GREEN": 1500, "YELLOW": 1500},
            whoseTurn: players[0],
            askPlayerToBuyCardFlag: false,
            askPlayerToBuyCard:  null,
            askPlayerToBuyCardPlayer: null
        };
    }

    showCardDetails = (card) => {
        this.setState({
            show_card_detaild_flag: true,
            selected_card: card
        })
    }

    dontShowCardDetails = () => {
        this.setState({
            show_card_detaild_flag: false,
            selected_card: null
        })        
    }

    renderPlayerAtThisPosition(position) {
        let playerAtThisPositionList = [];
        const { playerPositions } = this.state;
        Object.keys(playerPositions).forEach(function(key) {
            if(playerPositions[key] == position) {
                let playerColor = players[players.findIndex(p => p == key)];
                playerAtThisPositionList.push(
                    <div style={{backgroundColor: playerColor, height: '15px', width: '15px', borderRadius: '50%', display: 'inline-block', margin: '2%', border: '2px solid black'}}></div>
                );
            }
        })
        return(
            <div style={{marginLeft: '-20%', marginRight: '-20%'}}>
                {playerAtThisPositionList}
            </div>
        )
    }

    renderCard(card) {
        let card_color = '#FFF';
        switch(card.color) {
            case 'CHOCOLATE':
                card_color = '#99604b';
                break;
            case 'BLUE':
                card_color = '#30e3dd';
                break;
            case 'PINK':
                card_color = '#c621cc';
                break;
            case 'ORANGE':
                card_color = '#de7c31';
                break;
            case 'RED':
                card_color = '#d6594b';
                break;
            case 'YELLOW':
                card_color = '#dbd227';
                break;
            case 'GREEN':
                card_color = '#5cb846';
                break;
            case 'PURPLE':
                card_color = '#8a6eba';
                break;
        }
        return(
            <Card className="card-cell"
                style={{backgroundColor:card_color}}
                onClick={this.showCardDetails.bind(this, card)}
                >
                <Card.Body>
                <Card.Text>
                    {this.renderPlayerAtThisPosition(card.position)}
                    <Col>
                        <Row className="card-text">{card.card_name}</Row>
                        <Row className="card-text">{card.purchase_price}</Row>
                    </Col>
                </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    renderBoard() {
        const { cards } = this.state;
        let board_rows = [];
        for(let i=1; i <= 11; i++) {
            let table_data = [];
            // Only add 10 cards for 1st and last row...
            if(i == 1) {
                for(let j=0; j <= 10; j++) {
                    table_data.push(
                        <td>
                            {this.renderCard(cards[20+j])}
                        </td>
                    );
                }
            }
            else if(i == 11) {
                for(let j=10; j >= 0; j--) {
                    table_data.push(
                        <td>
                            {this.renderCard(cards[j])}
                        </td>
                    );
                }
            }
            else if(i == 6) {
                table_data.push(
                    <td>
                        {this.renderCard(cards[21-i])}
                    </td>
                );
                table_data.push(
                    <td colSpan="3"></td>
                );
                table_data.push(
                    <td colSpan="3" style={{textAlign: 'center', cursor: 'pointer'}}>
                        <ReactDice
                            numDice={1}
                            rollDone={this.rollDone.bind(this)}
                            outline="true"
                            outlineColor="#fff"
                            faceColor="#494d4a"
                            dotColor="#fff"
                            rollTime={1}
                            dieSize={50}
                        />
                        <div className="whose-turn">{this.state.whoseTurn}'s Turn</div>
                    </td>
                );
                table_data.push(
                    <td colSpan="3"></td>
                );
                table_data.push(
                    <td>
                        {this.renderCard(cards[29+i])}
                    </td>
                );                
            }
            else {
                table_data.push(
                    <td>
                        {this.renderCard(cards[21-i])}
                    </td>
                );
                table_data.push(
                    <td colSpan="9"></td>
                );
                table_data.push(
                    <td>
                        {this.renderCard(cards[29+i])}
                    </td>
                );
            }
            board_rows.push(
                <tr>
                    {table_data}
                </tr>
            )
        }

        return (
            <table id="board-table">
                <tbody>
                    {board_rows}
                </tbody>
            </table>
        )
    }
    
    whatToDoAfterDice = (player, position, dice_number) => {
        const card = this.state.cards.find((c) => c.position == position)
        switch(card.type) {
            case 'home':
                this.state.playerBalance[player] += 200;                 
                break;
            case 'normal':
                break;
            case 'tax':
                this.state.playerBalance[player] -= card.tax_amount;
                break;
            case 'parking':
                break;
            case 'jail':
                break;
            case 'chest':
                if(dice_number % 2 == 0)
                    this.state.playerBalance[player] -= 50;
                if(dice_number % 2 == 1)
                    this.state.playerBalance[player] += 50;                 
                break;
            case 'chance':
                if(dice_number % 2 == 0)
                    this.state.playerBalance[player] += 100;
                if(dice_number % 2 == 1)
                    this.state.playerBalance[player] -= 100;  
                break;
            case 'utility':
                if(card.owner == null) {
                    // Ask if player wants to buy if they have enough balance...
                    if(this.state.playerBalance[player] >= card.purchase_price) {
                        this.setState({
                            askPlayerToBuyCardFlag: true,
                            askPlayerToBuyCard: card,
                            askPlayerToBuyCardPlayer: player,
                        })
                    }
                }
                else if(card.owner == player) {
                    // It's safe for player. Do nothing!
                }
                else {
                    const card_owner = card.owner;
                    const utility_cards = this.state.cards.filter((c) => c.type == "utility");
                    const utility_cards_with_this_card_owner = this.state.cards.filter((c) => c.type == "utility" && c.owner == card_owner);
                    if(utility_cards.length == utility_cards_with_this_card_owner.length) {
                        // Pay 10x dice number...
                        this.state.playerBalance[player] -= 10 * dice_number;
                        this.state.playerBalance[card_owner] += 10 * dice_number;                        
                    }
                    else {
                        // Pay 4x dice number...
                        this.state.playerBalance[player] -= 4 * dice_number;
                        this.state.playerBalance[card_owner] += 4 * dice_number; 
                    }
                }
                break;
            case 'railway':
                if(card.owner == null) {
                    // Ask if player wants to buy if they have enough balance...
                    if(this.state.playerBalance[player] >= card.purchase_price) {
                        this.setState({
                            askPlayerToBuyCardFlag: true,
                            askPlayerToBuyCard: card,
                            askPlayerToBuyCardPlayer: player,
                        })
                    }
                }
                else if(card.owner == player) {
                    // It's safe for player. Do nothing!
                }
                else {
                    const card_owner = card.owner;
                    const railway_cards_with_this_card_owner = this.state.cards.filter((c) => c.type == "railway" && c.owner == card_owner);
                    // Pay as per owner's railway cards...
                    let rent = 0;
                    switch(railway_cards_with_this_card_owner.length) {
                        case 1:
                            rent = 25;
                            break;
                        case 2:
                            rent = 50;
                            break;
                        case 3:
                            rent = 100;
                            break;
                        case 4:
                            rent = 200;
                            break;                        
                    }
                    this.state.playerBalance[player] -= rent;
                    this.state.playerBalance[card_owner] += rent;
                }
                break;
            case 'go_to_jail':
                this.state.playerPositions[player] = 10;
                this.state.playerBalance[player] -= 50;
                break;
        }
    }

    rollDone(num) {
        this.state.playerPositions[this.state.whoseTurn] = (this.state.playerPositions[this.state.whoseTurn] + num) % 40;
        this.whatToDoAfterDice(this.state.whoseTurn, this.state.playerPositions[this.state.whoseTurn], num);
        this.setState({
            whoseTurn: players[(players.findIndex(p => p == this.state.whoseTurn) + 1) % 4],
        })
    }

    renderPlayerDetails() {
        let playerList = [];
        players.forEach((player) => {
            playerList.push(
                <tr>
                    <Card className="player-card"
                        style={{backgroundColor: player}}
                        >
                        <Card.Body>
                            <Card.Title className="card-text" style={{fontSize: 'small'}}>{player}</Card.Title>
                            <hr/>
                            <Card.Text>
                                <Col>
                                    <Row className="card-text">{this.state.playerBalance[player]}</Row>
                                </Col>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </tr>
            );
        })
        return(
            <table id="board-table">
                <tbody>
                    {playerList}
                </tbody>
            </table>
        )
    }

    buyCard = () => {
        this.state.playerBalance[this.state.askPlayerToBuyCardPlayer] -= this.state.askPlayerToBuyCard.purchase_price;
        const card = this.state.cards.find(c => c.position == this.state.askPlayerToBuyCard.position);
        card.owner = this.state.askPlayerToBuyCardPlayer;
        this.setState({
            askPlayerToBuyCardFlag: false,
            askPlayerToBuyCard:  null,
            askPlayerToBuyCardPlayer: null
        })
    }

    passCard = () => {
        this.setState({
            askPlayerToBuyCardFlag: false,
            askPlayerToBuyCard:  null,
            askPlayerToBuyCardPlayer: null
        })        
    }

    render() {
        return (
            <div>
                <div style={{display: 'inline-block'}}>
                    {this.renderBoard()}
                </div>
                
                <div style={{display: 'inline-block'}} className="player-details">
                    {this.renderPlayerDetails()}
                </div>
                
                {/* To display card details... */}
                {this.state.selected_card && <Modal show={this.state.show_card_detaild_flag} onHide={this.dontShowCardDetails}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.selected_card.card_name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row><Col>Purchase Price</Col><Col>{this.state.selected_card.purchase_price}</Col></Row>
                        <Row><Col>Mortgage Value</Col><Col>{this.state.selected_card.mortgage_value}</Col></Row>
                        <hr/>
                        <Row><Col>Rent</Col><Col>{this.state.selected_card.rent}</Col></Row>
                        <Row><Col>Rent with color set</Col><Col>{this.state.selected_card.rent}</Col></Row>
                        <Row><Col>Rent with 1 house</Col><Col>{this.state.selected_card.rent_with_1_house}</Col></Row>
                        <Row><Col>Rent with 2 house</Col><Col>{this.state.selected_card.rent_with_2_house}</Col></Row>
                        <Row><Col>Rent with 3 house</Col><Col>{this.state.selected_card.rent_with_3_house}</Col></Row>
                        <Row><Col>Rent with 4 house</Col><Col>{this.state.selected_card.rent_with_4_house}</Col></Row>
                        <Row><Col>Rent with hotel</Col><Col>{this.state.selected_card.rent_with_hotel}</Col></Row>
                        <hr/>
                        <Row><Col>Houses cost</Col><Col>{this.state.selected_card.house_cost}</Col></Row>
                        <Row><Col>Hotels cost</Col><Col>{this.state.selected_card.hotel_cost}</Col></Row>                        
                    </Modal.Body>
                </Modal>}

                {/* Ask user if they want to buy the card... */}
                {this.state.askPlayerToBuyCard && <Modal show={this.state.askPlayerToBuyCardFlag}>
                    <Modal.Header>
                        <Modal.Title>{this.state.askPlayerToBuyCard.card_name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row><Col>Purchase Price</Col><Col>{this.state.askPlayerToBuyCard.purchase_price}</Col></Row>
                        <Row><Col>Mortgage Value</Col><Col>{this.state.askPlayerToBuyCard.mortgage_value}</Col></Row>
                        <hr/>
                        <Row><Col>Rent</Col><Col>{this.state.askPlayerToBuyCard.rent}</Col></Row>
                        <Row><Col>Rent with color set</Col><Col>{this.state.askPlayerToBuyCard.rent}</Col></Row>
                        <Row><Col>Rent with 1 house</Col><Col>{this.state.askPlayerToBuyCard.rent_with_1_house}</Col></Row>
                        <Row><Col>Rent with 2 house</Col><Col>{this.state.askPlayerToBuyCard.rent_with_2_house}</Col></Row>
                        <Row><Col>Rent with 3 house</Col><Col>{this.state.askPlayerToBuyCard.rent_with_3_house}</Col></Row>
                        <Row><Col>Rent with 4 house</Col><Col>{this.state.askPlayerToBuyCard.rent_with_4_house}</Col></Row>
                        <Row><Col>Rent with hotel</Col><Col>{this.state.askPlayerToBuyCard.rent_with_hotel}</Col></Row>
                        <hr/>
                        <Row><Col>Houses cost</Col><Col>{this.state.askPlayerToBuyCard.house_cost}</Col></Row>
                        <Row><Col>Hotels cost</Col><Col>{this.state.askPlayerToBuyCard.hotel_cost}</Col></Row>                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            style={{
                                padding: '16px',
                                fontSize: '21px'
                            }}
                            onClick={this.buyCard.bind(this)}>
                            BUY @ {this.state.askPlayerToBuyCard.purchase_price}
                        </Button>
                        <Button
                            style={{
                                padding: '16px',
                                fontSize: '21px',
                                marginLeft: '10px'
                            }}
                            onClick={this.passCard.bind(this)}>
                            PASS
                        </Button>
                    </Modal.Footer>
                </Modal>}
            </div>
        );
    }
}

export default (Home);
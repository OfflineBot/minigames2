"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
class Game {
    constructor() {
        this._players = [];
        this._player_order = [];
    }
    add_player(id, name) {
        this._players.push({ id: id, name: name });
    }
    remove_player(id) {
        this._players = this._players.filter(item => item.id !== id);
    }
    get_player_ids() {
        let ids = [];
        for (let i = 0; i < this._players.length; i++) {
            ids.push(this._players[i].id);
        }
        return ids;
    }
    get_player_order() {
        return this._player_order;
    }
    get_player() {
        let players = [];
        for (let i = 0; i < this._players.length; i++) {
            players.push(this._players[i].name);
        }
        players = players.sort();
        return players;
    }
    player_count() {
        return this._players.length;
    }
    init_game() {
        this.shuffle_players();
    }
    set_player_text_element(content, idx, id) {
        if (idx > this._player_order.length) {
            console.log("Index out of range! Idx: ", idx);
            return;
        }
        let player_pos = -1;
        for (let i = 0; i < this._players.length; i++) {
            if (this._player_order[idx][i].id === id) {
                player_pos = i;
            }
        }
        if (player_pos === -1) {
            console.log("player not found!");
            return;
        }
        this._player_order[idx][player_pos].user.content = content;
    }
    get_playername_by_id(id) {
        for (let i = 0; i < this.player_count(); i++) {
            if (this._players[i].id === id) {
                return this._players[i].name;
            }
        }
        return "";
    }
    shuffle_players() {
        const n = this._players.length;
        for (let i = 0; i < n; i++) {
            const row = this._players
                .slice(i)
                .concat(this._players.slice(0, i))
                .map(p => ({ id: p.id, user: { name: this.get_playername_by_id(p.id), content: "" } }));
            this._player_order.push(row);
        }
        for (let i = this._player_order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._player_order[i], this._player_order[j]] = [this._player_order[j], this._player_order[i]];
        }
    }
    generate_prev(idx, current_id) {
        let player = this._player_order;
        let current_y_idx = -1;
        for (let i = 0; i < this.player_count(); i++) {
            if (player[idx][i].id === current_id) {
                current_y_idx = i;
            }
        }
        let id_at_idx_0 = player[0][current_y_idx].id;
        for (let i = 0; i < this.player_count(); i++) {
            if (player[idx - 1][i].id === id_at_idx_0) {
                return player[idx - 1][i].user.content;
            }
        }
    }
    println_player_order() {
        for (let i = 0; i < this._player_order.length; i++) {
            let txt = "";
            for (let j = 0; j < this._player_order[0].length; j++) {
                let content = this._player_order[i][j].user.content;
                let name = this._player_order[i][j].user.name;
                content = content === "" ? "none" : content;
                txt += ` - ${name} - `;
            }
            console.log(txt);
        }
    }
}
exports.Game = Game;

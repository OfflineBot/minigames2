"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup_socket = setup_socket;
function empty_submited(id_list) {
    let out = [];
    for (let i = 0; i < id_list.length; i++) {
        out.push({ id: id_list[i], ready: false });
    }
    return out;
}
function update_submited(submition_list, id) {
    for (let i = 0; i < submition_list.length; i++) {
        let sub_id = submition_list[i].id;
        if (sub_id === id) {
            submition_list[i].ready = true;
        }
    }
}
function check_all_ready(submition_list) {
    let ready = true;
    for (let i = 0; i < submition_list.length; i++) {
        if (!submition_list[i].ready) {
            ready = false;
        }
    }
    return ready;
}
function setup_socket(io, game) {
    let player_count = 0;
    let game_iteration = 0;
    let player_submited = [];
    io.on('connection', (socket) => {
        console.log("User connected: ", socket.id);
        socket.emit("go_login");
        socket.on('disconnect', () => {
            const id = socket.id;
            game.remove_player(id);
            console.log("User disconnected: ", socket.id);
            io.emit("update_player", game.get_player());
        });
        socket.on('register', (username) => {
            const id = socket.id;
            game.add_player(id, username);
            socket.emit("go_lobby", game.get_player());
            io.emit("update_player", game.get_player());
        });
        socket.on('start_game', () => {
            game.init_game();
            game.println_player_order();
            player_count = game.player_count();
            player_submited = empty_submited(game.get_player_ids());
            io.emit("start_game");
        });
        socket.on('game_submit', (text) => {
            update_submited(player_submited, socket.id);
            game.set_player_text_element(text, game_iteration, socket.id);
            let player_ready = check_all_ready(player_submited);
            // all have submitted
            if (player_ready) {
                game.println_player_order();
                game_iteration += 1;
                // last round has finished
                if (game_iteration >= player_count) {
                    game_iteration = 0;
                    io.emit("result_page", game.get_player_order());
                }
                else {
                    for (let i = 0; i < game.player_count(); i++) {
                        const target_id = game.get_player_ids()[i];
                        if (!target_id) {
                            console.log("this should not print. or player left!");
                            return;
                        }
                        let prev_text = game.generate_prev(game_iteration, target_id);
                        io.to(target_id).emit("next_round", prev_text);
                        player_submited = empty_submited(game.get_player_ids());
                    }
                    console.log("next round: ", game_iteration);
                }
            }
        });
        // MISSING
        socket.on('result_page', () => {
            io.emit("result_page", game.get_player_order());
        });
        socket.on("new_game", () => {
            io.emit("new_game");
        });
    });
}

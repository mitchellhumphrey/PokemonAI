#include "moves.h"

std::pair<const std::string, PokemonMove> make_move(std::string name) {
  return {name, {}};
}

const std::unordered_map<std::string, PokemonMove> moves = {
    make_move("Aurora Beam"),

};
#pragma once
#include <string>
#include <unordered_map>

enum class type {};

struct PokemonMove {
  std::string name;
  int defaultPP;
  int damage;
  int accuracy;
  // todo
  PokemonMove() {
    // todo
  }
};

extern const std::unordered_map<std::string, PokemonMove> moves;
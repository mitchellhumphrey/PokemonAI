#pragma once

#include "helper.h"
#include "items.h"
#include "moves.h"
#include <string>
#include <vector>

struct PokemonTeam {
  std::vector<Pokemon> team;
  std::string trainerName;
};

struct Pokemon {
  bool isDead, isKnown;
  double health;
  StatusCondition status;
  int level;
  Stats stats;

  std::vector<const PokemonMove *> knownMoves;
  std::vector<const PokemonMove *> possibleMoves;

  PokemonItem *knownItem;
  std::vector<const PokemonItem *> possibleItems;
};

struct Stats {};

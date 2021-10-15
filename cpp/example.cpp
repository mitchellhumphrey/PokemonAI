#include "example.h"
#include "json.hpp"
#include <iostream>
#include <stdlib.h>
#include <string>
#include <time.h>

int functionexample::add(int a, int b) { return a + b; }

using json = nlohmann::json;

Napi::String returnchoice(const Napi::CallbackInfo &info) {

  srand(time(NULL));

  Napi::Env env = info.Env();
  std::string temp = info[0].As<Napi::String>();
  json j = json::parse(temp);
  std::cout << "FROM CPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP" << std::endl;
  std::cout << j["active"][0]["moves"].size() << std::endl;

  if (j["active"][0]["moves"].size() == 0) {
    return Napi::String::New(env, "");
  }

  return Napi::String::New(
      env, "|/move " +
	       std::to_string((rand() % j["active"][0]["moves"].size()) + 1));
};

Napi::Number functionexample::AddWrapped(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
  }

  Napi::Number first = info[0].As<Napi::Number>();
  Napi::Number second = info[1].As<Napi::Number>();

  int returnValue =
      functionexample::add(first.Int32Value(), second.Int32Value());

  return Napi::Number::New(env, returnValue);
}

Napi::String functionexample::HelloWrapped(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  Napi::String returnValue = Napi::String::New(env, "Hello World");

  return returnValue;
}

Napi::Object functionexample::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("hello", Napi::Function::New(env, functionexample::HelloWrapped));
  exports.Set("add", Napi::Function::New(env, functionexample::AddWrapped));
  exports.Set("startPoint", Napi::Function::New(env, returnchoice));
  return exports;
}
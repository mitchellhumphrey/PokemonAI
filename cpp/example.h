#include <napi.h>
namespace functionexample {
Napi::String HelloWrapped(const Napi::CallbackInfo &info);
Napi::Object Init(Napi::Env env, Napi::Object exports);

int add(int a, int b);
Napi::Number AddWrapped(const Napi::CallbackInfo &info);

Napi::Object Init(Napi::Env env, Napi::Object exports);

} // namespace functionexample
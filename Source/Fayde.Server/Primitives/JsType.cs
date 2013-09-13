﻿using Fayde.Xaml;
using Fayde.Xaml.Metadata;

namespace Fayde.Primitives
{
    public class JsType : IJsonConvertible
    {
        public string Value { get; protected set; }

        public JsType(string value)
        {
            Value = value;
        }

        public string ToJson(int tabIndents, IJsonOutputModifiers outputMods)
        {
            var type = TypeResolver.GetElementTypeInDefaultNamespace(Value);
            if (type == null)
                return Value;
            return ElementAttribute.GetFullNullstoneType(type, outputMods);
        }
    }
}
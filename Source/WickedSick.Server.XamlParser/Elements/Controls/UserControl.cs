﻿
namespace WickedSick.Server.XamlParser.Elements.Controls
{
    [Element("Fayde.Controls")]
    public class UserControl : Control
    {
        public static readonly PropertyDescription ContentProperty = PropertyDescription.Register("Content", typeof(UIElement), typeof(UserControl), true);
    }
}
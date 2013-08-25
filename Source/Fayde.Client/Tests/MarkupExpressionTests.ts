/// <reference path="qunit-1.10.0.d.ts" />

QUnit.module("Markup Expression Tests");

test("x:Null", () => {
    var xaml = "<Border xmlns=\"http://schemas.wsick.com/fayde\" xmlns:x=\"http://schemas.wsick.com/fayde/x\" Tag=\"{x:Null}\"></Border>";
    var border = <Fayde.Controls.Border>Fayde.Xaml.Load(xaml);
    strictEqual(border.Tag, null, "x:Null");
});

test("x:Type", () => {
    var xaml = "<Grid xmlns=\"http://schemas.wsick.com/fayde\" xmlns:x=\"http://schemas.wsick.com/fayde/x\" Tag=\"{x:Type Border}\"></Grid>";
    var grid = <Fayde.Controls.Grid>Fayde.Xaml.Load(xaml);
    strictEqual(grid.Tag, Fayde.Controls.Border, "x:Type");
});

test("x:Static", () => {
    ok(true, "Not Implemented yet");
});

test("TemplateBinding", () => {
    var xaml = "<Grid xmlns=\"http://schemas.wsick.com/fayde\" xmlns:x=\"http://schemas.wsick.com/fayde/x\">"
        + "<Grid.Resources>"
        + "<Style x:Key=\"SomeStyle\" TargetType=\"Button\">"
        + "<Setter Property=\"Template\">"
        + "<Setter.Value>"
        + "<ControlTemplate TargetType=\"Button\">"
        + "<Border Margin=\"{TemplateBinding Padding}\" />"
        + "</ControlTemplate>"
        + "</Setter.Value>"
        + "</Setter>"
        + "</Style>"
        + "</Grid.Resources>"
        + "</Grid>";
    var grid = <Fayde.Controls.Grid>Fayde.Xaml.Load(xaml);
    var style = <Fayde.Style>grid.Resources.Get("SomeStyle");
    style.Seal();
    var setter = style.Setters.GetValueAt(0);
    var template = <Fayde.Controls.ControlTemplate>setter.ConvertedValue;
    var button = new Fayde.Controls.Button();
    var border = <Fayde.Controls.Border>template.GetVisualTree(button);

    button.Padding = new Thickness(1, 2, 3, 4);
    ok(Thickness.Equals(border.Margin, button.Padding), "After");
});

test("StaticResource", () => {
    var xaml = "<Grid xmlns=\"http://schemas.wsick.com/fayde\" xmlns:x=\"http://schemas.wsick.com/fayde/x\">"
        + "<Grid.Resources>"
        + "<x:Thickness x:Key=\"TestThickness\">1,2,3,4</x:Thickness>"
        + "</Grid.Resources>"
        + "<Border Margin=\"{StaticResource TestThickness}\" />"
        + "</Grid>";
    var grid = <Fayde.Controls.Grid>Fayde.Xaml.Load(xaml);
    var border = <Fayde.Controls.Border>grid.Children.GetValueAt(0);
    ok(Thickness.Equals(border.Margin, new Thickness(1, 2, 3, 4)), "Value");
});

test("Binding", () => {
    var xaml = "<Grid xmlns=\"http://schemas.wsick.com/fayde\" xmlns:x=\"http://schemas.wsick.com/fayde/x\">"
        + "<Border Margin=\"{Binding TestPath}\" />"
        + "</Grid>";
    var grid = <Fayde.Controls.Grid>Fayde.Xaml.Load(xaml);
    var border = <Fayde.Controls.Border>grid.Children.GetValueAt(0);
    var expr = border.GetBindingExpression(Fayde.FrameworkElement.MarginProperty);
    ok(expr instanceof Fayde.Data.BindingExpression, "Type");
    var binding = expr.ParentBinding;
    strictEqual(binding.Path.Path, "TestPath", "Path");


});

test("RelativeSource", () => {
    ok(true, "Not Implemented yet");
});
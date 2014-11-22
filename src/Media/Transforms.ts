/// <reference path="Transform.ts" />
/// <reference path="../Core/XamlObjectCollection.ts" />

module Fayde.Media {
    export class RotateTransform extends Transform {
        static AngleProperty = DependencyProperty.Register("Angle", () => Number, RotateTransform, 0, (d: RotateTransform, args) => d.InvalidateValue());
        static CenterXProperty = DependencyProperty.Register("CenterX", () => Number, RotateTransform, 0, (d: RotateTransform, args) => d.InvalidateValue());
        static CenterYProperty = DependencyProperty.Register("CenterY", () => Number, RotateTransform, 0, (d: RotateTransform, args) => d.InvalidateValue());
        Angle: number;
        CenterX: number;
        CenterY: number;

        _BuildValue (): number[] {
            var cx = this.CenterX;
            var cy = this.CenterY;
            var angle = 360 - this.Angle; //Rotation matrix rotates counter-clockwise; Silverlight rotates clockwise
            var angleRad = Math.PI / 180 * angle;
            var m = mat3.createRotate(angleRad);
            if (cx === 0 && cy === 0)
                return m;

            //move center {x,y} to {0,0}, rotate, then slide {x,y} back to {x,y}
            mat3.multiply(mat3.createTranslate(-cx, -cy), m, m); //m = m * translation
            mat3.translate(m, cx, cy);
            return m;
        }
    }
    Fayde.RegisterType(RotateTransform, Fayde.XMLNS);

    export class ScaleTransform extends Transform {
        static CenterXProperty = DependencyProperty.Register("CenterX", () => Number, ScaleTransform, 0, (d: ScaleTransform, args) => d.InvalidateValue());
        static CenterYProperty = DependencyProperty.Register("CenterY", () => Number, ScaleTransform, 0, (d: ScaleTransform, args) => d.InvalidateValue());
        static ScaleXProperty = DependencyProperty.Register("ScaleX", () => Number, ScaleTransform, 1.0, (d: ScaleTransform, args) => d.InvalidateValue());
        static ScaleYProperty = DependencyProperty.Register("ScaleY", () => Number, ScaleTransform, 1.0, (d: ScaleTransform, args) => d.InvalidateValue());
        CenterX: number;
        CenterY: number;
        ScaleX: number;
        ScaleY: number;

        _BuildValue (): number[] {
            var cx = this.CenterX;
            var cy = this.CenterY;
            var m = mat3.createScale(this.ScaleX, this.ScaleY);
            if (cx === 0 && cy === 0)
                return m;

            //move center {x,y} to {0,0}, scale, then slide {x,y} back to {x,y}
            mat3.multiply(mat3.createTranslate(-cx, -cy), m, m); //m = m * translation
            mat3.translate(m, cx, cy);
            return m;
        }
    }
    Fayde.RegisterType(ScaleTransform, Fayde.XMLNS);

    export class SkewTransform extends Transform {
        static AngleXProperty = DependencyProperty.Register("AngleX", () => Number, SkewTransform, 0, (d: SkewTransform, args) => d.InvalidateValue());
        static AngleYProperty = DependencyProperty.Register("AngleY", () => Number, SkewTransform, 0, (d: SkewTransform, args) => d.InvalidateValue());
        static CenterXProperty = DependencyProperty.Register("CenterX", () => Number, SkewTransform, 0, (d: SkewTransform, args) => d.InvalidateValue());
        static CenterYProperty = DependencyProperty.Register("CenterY", () => Number, SkewTransform, 0, (d: SkewTransform, args) => d.InvalidateValue());
        AngleX: number;
        AngleY: number;
        CenterX: number;
        CenterY: number;

        _BuildValue (): number[] {
            var cx = this.CenterX;
            var cy = this.CenterY;
            var angleXRad = Math.PI / 180 * this.AngleX;
            var angleYRad = Math.PI / 180 * this.AngleY;
            var m = mat3.createSkew(angleXRad, angleYRad);
            if (cx === 0 && cy === 0)
                return m;

            //move center {x,y} to {0,0}, scale, then slide {x,y} back to {x,y}
            mat3.multiply(mat3.createTranslate(-cx, -cy), m, m); //m = m * translation
            mat3.translate(m, cx, cy);
            return m;
        }
    }
    Fayde.RegisterType(SkewTransform, Fayde.XMLNS);

    export class TranslateTransform extends Transform {
        static XProperty = DependencyProperty.Register("X", () => Number, TranslateTransform, 0, (d: TranslateTransform, args) => d.InvalidateValue());
        static YProperty = DependencyProperty.Register("Y", () => Number, TranslateTransform, 0, (d: TranslateTransform, args) => d.InvalidateValue());
        X: number;
        Y: number;

        _BuildValue (): number[] {
            return mat3.createTranslate(this.X, this.Y);
        }
    }
    Fayde.RegisterType(TranslateTransform, Fayde.XMLNS);

    export class TransformCollection extends XamlObjectCollection<Transform> {
        AddingToCollection (value: Transform, error: BError): boolean {
            if (!super.AddingToCollection(value, error))
                return false;
            ReactTo(value, this, () => Incite(this));
            Incite(this);
            return true;
        }

        RemovedFromCollection (value: Transform, isValueSafe: boolean) {
            if (!super.RemovedFromCollection(value, isValueSafe))
                return false;
            UnreactTo(value, this);
            Incite(this);
        }
    }
    Fayde.RegisterType(TransformCollection, Fayde.XMLNS);

    export class TransformGroup extends Transform {
        static ChildrenProperty = DependencyProperty.RegisterImmutable<TransformCollection>("Children", () => TransformCollection, TransformGroup);
        Children: TransformCollection;

        constructor () {
            super();
            var coll = TransformGroup.ChildrenProperty.Initialize(this);
            ReactTo(coll.AttachTo(this), this, () => this.InvalidateValue());
        }

        _BuildValue (): number[] {
            var enumerator = this.Children.getEnumerator(true);
            var cur = mat3.identity();
            while (enumerator.moveNext()) {
                mat3.multiply((<Transform>enumerator.current).Value._Raw, cur, cur); //cur = cur * child
            }
            return cur;
        }
    }
    Fayde.RegisterType(TransformGroup, Fayde.XMLNS);
    Markup.Content(TransformGroup, TransformGroup.ChildrenProperty);
}
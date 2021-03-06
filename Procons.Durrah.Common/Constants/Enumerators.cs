﻿using System.ComponentModel;

namespace Procons.Durrah.Common.Enumerators
{
    public enum AccountTypes
    {
        Debit,
        Credit
    }
    //Currently Supported Actions
    public enum DocActiontType
    {
        Close = 1,
        Cancel = 2
    }

    //The property types when formatting JSON in WCF client.
    public enum PropertyType
    {
        SimpleEdmx = 0,
        ComplexType = 1,
        Collection = 2
    }

    public enum UpdateSemantics
    {
        PUT = 0,
        PATCH = 1
    }

    public enum Languages
    {
        [Description("en")]
        English,
        [Description("ar")]
        Arabic
    }

    public enum WorkerStatus
    {
        [Description(Constants.Resources.WorkerStatus_Unavailable)]
        Closed = 0,
        [Description(Constants.Resources.WorkerStatus_Available)]
        Opened = 1,
        [Description(Constants.Resources.WorkerStatus_Booked)]
        Booked = 2
    }

    public enum KnetResults
    {
        [Description("CAPTURED")]
        CAPTURED,
        [Description("CANCELED")]
        CANCELED,
        [Description("NOT CAPTURED")]
        NOTCAPTURED
    }

    //public enum Operation
    //{
    //    EqualTo,
    //    NotEqualTo,
    //    GreaterThan,
    //    GreaterThanOrEqualTo,
    //    LessThan,
    //    LessThanOrEqualTo
    //}

}

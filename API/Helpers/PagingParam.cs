using System;

namespace API.Helpers;

public class PagingParam
{
  private const int MaximunPageSize = 50;

  private int _pageSize = 10;

  public int PageNumber{get;set;} = 1;
  public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaximunPageSize) ? MaximunPageSize : value;
    }
}

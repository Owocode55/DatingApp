using System;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PaginatedResult<T>
{
   public PaginationMetaData MetaData {get;set;} = default!;

   public List<T> Items {get;set;} = [] ;
}

public class PaginationMetaData
{
    public int TotalCount {get; set;}
    public int CurrentPage {get; set;}
    public int PageSize {get;set;}
    public int TotalPages {get;set;}
}

public class PaginationHelper
{
    public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> query ,int currentPage , int pageSize)
    {
        var count = await query.CountAsync();

        var items = await query.Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PaginatedResult<T>
        {
            Items = items,
            MetaData = new PaginationMetaData
            {
             CurrentPage = currentPage,
             TotalCount = count,
             TotalPages = (int)Math.Ceiling(count/ (double)pageSize),
             PageSize = pageSize  
            }
        };
    }
}

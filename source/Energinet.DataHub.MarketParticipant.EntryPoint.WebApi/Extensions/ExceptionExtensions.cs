// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System;
using System.Linq;
using Energinet.DataHub.MarketParticipant.Domain.Exception;
using Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DataAnnotationException = System.ComponentModel.DataAnnotations.ValidationException;
using FluentValidationException = FluentValidation.ValidationException;

namespace Energinet.DataHub.MarketParticipant.EntryPoint.WebApi.Extensions
{
    // TODO: This is a copy from PO, we need to streamline this.
    public static class ExceptionExtensions
    {
        public static void Log(this Exception source, ILogger logger)
        {
            ArgumentNullException.ThrowIfNull(source, nameof(source));

            if (source is not FluentValidationException or DataAnnotationException)
            {
                logger.LogError(source, "An error occurred while processing request");

                // Observed that LogError does not always write the exception.
                logger.LogError(source.ToString());
            }
        }

        public static IActionResult AsIActionResult(this Exception source)
        {
            ArgumentNullException.ThrowIfNull(source, nameof(source));

            return source switch
            {
                NotFoundValidationException =>
                   new NotFoundResult(),
                FluentValidationException ve =>
                    new BadRequestObjectResult(new ErrorResponse(new ErrorDescriptor(
                        "VALIDATION_EXCEPTION",
                        "See details",
                        details: ve.Errors.Select(x =>
                            new ErrorDescriptor(
                                x.ErrorCode,
                                x.ErrorMessage,
                                x.PropertyName))))),

                DataAnnotationException ve =>
                    new BadRequestObjectResult(new ErrorResponse(new ErrorDescriptor(
                        "VALIDATION_EXCEPTION",
                        ve.Message))),
                _ =>
                    new ObjectResult(new ErrorResponse(new ErrorDescriptor(
                        "INTERNAL_ERROR",
                        "An error occured while processing the request."))) { StatusCode = StatusCodes.Status500InternalServerError }
            };
        }
    }
}

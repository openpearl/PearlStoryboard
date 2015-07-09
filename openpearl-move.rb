module OpenpearlMove
  class PearlClass

    def handleExerciseFrequency(clientContext)

      # Compare today's exercise to prior exercise.
      compare = clientContext.minExercisedToday <=> clientContext.minExercisedAverage

      # Return the correct tags.
      case compare
      when -1
        return ["below"]
      when 0
        return ["between"]
      when 1
        return ["above"]
      else
        puts "Comparison not successful."
      end
    end
  end
end
